import { User } from '../models/User.js';
import { Company } from '../models/Company.js';
import { permissionsForRole, roleCompanyType } from '../permissions.js';
import { recordActivity } from '../services/activity.js';

function recordDeniedAccess(req, details) {
  if (!req.user?.id || !req.user?.company?.id) return;
  void recordActivity({
    companyId: req.user.company.id,
    userId: req.user.id,
    action: 'authorization_denied',
    details,
  }).catch(() => {});
}

export function logAuthorizationDenial(req, {
  reason,
  expectedCompanyType = null,
  requiredPermission = null,
}, write = (line) => process.stderr.write(line)) {
  const company = req.user?.company;
  const companyId = company?._id ?? company?.id;
  const routePath = typeof req.route?.path === 'string'
    ? `${req.baseUrl ?? ''}${req.route.path}`
    : `${req.baseUrl ?? ''}${req.path ?? ''}`.split('?')[0];
  const diagnostic = {
    event: 'authorization_denied',
    method: req.method ?? null,
    path: routePath || '/',
    userId: req.user?.id ? String(req.user.id) : null,
    role: req.user?.role ?? null,
    companyId: companyId == null ? null : String(companyId),
    companyType: company?.type ?? null,
    expectedCompanyType,
    reason,
    ...(requiredPermission ? { requiredPermission } : {}),
  };
  write(`[BridgeSync API] ${JSON.stringify(diagnostic)}\n`);
  return diagnostic;
}

export async function requireAuth(req, res, next) {
  try {
    const userId = req.session?.userId;
    if (!userId) return res.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'Sign in to continue.' } });

    const user = await User.findOne({ _id: userId, active: true }).select('displayName email companyId role active');
    if (!user) {
      req.session.destroy(() => {});
      return res.status(401).json({ error: { code: 'AUTH_REQUIRED', message: 'Sign in to continue.' } });
    }

    const expectedType = roleCompanyType(user.role);
    if (!expectedType) return res.status(403).json({ error: { code: 'ACCESS_DENIED', message: 'Access is not authorized.' } });

    const company = await Company.findById(user.companyId).select('name slug type mark');
    if (!company || company.type !== expectedType) {
      req.session.destroy(() => {});
      return res.status(403).json({ error: { code: 'ACCESS_DENIED', message: 'Access is not authorized.' } });
    }

    req.user = { id: user.id, displayName: user.displayName, email: user.email, role: user.role, company, permissions: permissionsForRole(user.role) };
    return next();
  } catch (error) {
    return next(error);
  }
}

export function requireCompanyType(type) {
  return (req, res, next) => {
    if (req.user?.company?.type !== type) {
      logAuthorizationDenial(req, {
        reason: 'company_type_mismatch',
        expectedCompanyType: type,
      });
      recordDeniedAccess(req, 'company dashboard access denied');
      return res.status(403).json({ error: { code: 'ACCESS_DENIED', message: 'Access is not authorized.' } });
    }
    return next();
  };
}

export function requirePermission(permission) {
  return (req, res, next) => {
    if (!req.user?.permissions?.includes(permission)) {
      logAuthorizationDenial(req, {
        reason: 'permission_missing',
        expectedCompanyType: req.user?.company?.type ?? null,
        requiredPermission: permission,
      });
      recordDeniedAccess(req, permission.slice(0, 120));
      return res.status(403).json({ error: { code: 'ACCESS_DENIED', message: 'Access is not authorized.' } });
    }
    return next();
  };
}

export function requireSessionOrigin(appOrigin) {
  return (req, res, next) => {
    const origin = req.get('origin');
    if (origin && origin !== appOrigin) {
      return res.status(403).json({ error: { code: 'ORIGIN_NOT_ALLOWED', message: 'Request could not be verified.' } });
    }
    return next();
  };
}
