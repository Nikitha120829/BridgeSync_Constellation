import { Router } from 'express';
import { requireAuth, requireCompanyType, requirePermission } from '../middleware/auth.js';
import { getBuyerDashboard, getSupplierDashboard } from '../services/dashboard.js';

export const dashboardRouter = Router();

dashboardRouter.get(
  '/buyer',
  requireAuth,
  requireCompanyType('buyer'),
  requirePermission('buyer:dashboard:view'),
  async (req, res, next) => {
    try {
      return res.json({ dashboard: await getBuyerDashboard(req.user) });
    } catch (error) {
      return next(error);
    }
  },
);

dashboardRouter.get(
  '/supplier',
  requireAuth,
  requireCompanyType('supplier'),
  requirePermission('supplier:dashboard:view'),
  async (req, res, next) => {
    try {
      return res.json({ dashboard: await getSupplierDashboard(req.user) });
    } catch (error) {
      return next(error);
    }
  },
);
