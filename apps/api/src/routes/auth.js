import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import { Company } from '../models/Company.js';
import { User } from '../models/User.js';
import { requireAuth } from '../middleware/auth.js';
import { permissionsForRole } from '../permissions.js';
import { recordActivity } from '../services/activity.js';

export const loginCredentialsSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(128),
  workspaceContext: z.enum(['apex-motors', 'nova-components']),
  remember: z.boolean().optional().default(false),
}).strict();

const invalidCredentials = { error: { code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect.' } };

function safeUser(user, company) {
  return {
    id: user.id,
    displayName: user.displayName,
    email: user.email,
    role: user.role,
    permissions: permissionsForRole(user.role),
    company: {
      id: company.id,
      name: company.name,
      slug: company.slug,
      type: company.type,
      mark: company.mark,
    },
  };
}

function regenerateSession(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((error) => error ? reject(error) : resolve());
  });
}

function saveSession(req) {
  return new Promise((resolve, reject) => {
    req.session.save((error) => error ? reject(error) : resolve());
  });
}

export function createAuthRouter({ isProduction }) {
  const router = Router();
  const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 10,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { error: { code: 'LOGIN_RATE_LIMITED', message: 'Too many sign-in attempts. Try again later.' } },
  });

  router.post('/login', loginLimiter, async (req, res, next) => {
    const parsed = loginCredentialsSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: { code: 'INVALID_REQUEST', message: 'Enter a valid email, password, and workspace.' } });
    }

    try {
      const { email, password, workspaceContext, remember } = parsed.data;
      const user = await User.findOne({ email: email.toLowerCase(), active: true }).select('+passwordHash');
      if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.status(401).json(invalidCredentials);
      }

      const company = await Company.findById(user.companyId).select('name slug type mark');
      const roleExpectedType = user.role.startsWith('buyer_') ? 'buyer' : user.role.startsWith('supplier_') ? 'supplier' : null;
      if (!company || company.slug !== workspaceContext || company.type !== roleExpectedType) {
        return res.status(401).json(invalidCredentials);
      }

      await regenerateSession(req);
      req.session.userId = user.id;
      req.session.cookie.maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 12 * 60 * 60 * 1000;
      await saveSession(req);
      await recordActivity({ companyId: company.id, userId: user.id, action: 'login_success' });

      return res.json({ user: safeUser(user, company) });
    } catch (error) {
      return next(error);
    }
  });

  router.get('/me', requireAuth, async (req, res) => {
    const user = await User.findById(req.user.id).select('displayName email role');
    return res.json({ user: safeUser(user, req.user.company) });
  });

  router.post('/logout', requireAuth, async (req, res, next) => {
    try {
      await recordActivity({ companyId: req.user.company.id, userId: req.user.id, action: 'logout' });
      req.session.destroy((error) => {
        if (error) return next(error);
        res.clearCookie('bridgesync.sid', {
          httpOnly: true,
          secure: isProduction,
          sameSite: 'lax',
          path: '/',
        });
        return res.status(204).end();
      });
    } catch (error) {
      return next(error);
    }
  });

  return router;
}
