import { Activity } from '../models/Activity.js';
import { Inventory } from '../models/Inventory.js';
import { Product } from '../models/Product.js';
import { PurchaseOrder } from '../models/PurchaseOrder.js';
import { hasPermission } from '../permissions.js';
import { activityScope, buyerOrderScope, inventoryScope, productScope, supplierOrderScope } from './dashboardScope.js';

const orderFields = 'orderNumber productName productSku quantity currency orderDate requiredBy status buyerApprovalStatus supplierApprovalStatus';

async function recentActivity(companyId) {
  const rows = await Activity.find(activityScope(companyId)).sort({ occurredAt: -1 }).limit(8).populate('actorUserId', 'displayName').lean();
  return rows.map((row) => ({ id: String(row._id), action: row.action, details: row.details, actor: row.actorUserId?.displayName ?? 'Former user', occurredAt: row.occurredAt }));
}

export async function getBuyerDashboard(user) {
  const companyId = user.company._id;
  const scope = buyerOrderScope(companyId);
  const [totalOrders, pendingOrders, inProgressOrders, ordersNeedingAttention, recentOrders, activity] = await Promise.all([
    PurchaseOrder.countDocuments(scope),
    PurchaseOrder.countDocuments({ ...scope, status: 'pending_supplier_confirmation' }),
    PurchaseOrder.countDocuments({ ...scope, status: { $in: ['confirmed', 'in_progress'] } }),
    PurchaseOrder.countDocuments({ ...scope, status: 'needs_attention' }),
    PurchaseOrder.find(scope).sort({ orderDate: -1 }).limit(6).select(orderFields).populate('supplierCompanyId', 'name mark'),
    hasPermission(user.role, 'buyer:activity:read') ? recentActivity(companyId) : [],
  ]);
  const pendingApprovals = hasPermission(user.role, 'buyer:approvals:read')
    ? await PurchaseOrder.countDocuments({ ...scope, buyerApprovalStatus: 'pending' }) : null;
  return {
    company: { name: user.company.name, mark: user.company.mark }, user: { displayName: user.displayName, role: user.role },
    metrics: { totalOrders, pendingOrders, inProgressOrders, ordersNeedingAttention, pendingApprovals },
    recentOrders: recentOrders.map((order) => ({ id: order.id, orderNumber: order.orderNumber, supplier: order.supplierCompanyId?.name ?? 'Partner', product: order.productName, sku: order.productSku, quantity: order.quantity, currency: order.currency, orderDate: order.orderDate, status: order.status })),
    recentActivity: activity,
  };
}

export async function getSupplierDashboard(user) {
  const companyId = user.company._id;
  const canReadInventory = hasPermission(user.role, 'supplier:inventory:read');
  const scope = supplierOrderScope(companyId);
  const [totalProducts, inventoryRows, incomingOrders, pendingSupplierResponses, inventoryRecords, recentOrders, activity] = await Promise.all([
    canReadInventory ? Product.countDocuments(productScope(companyId)) : null,
    canReadInventory ? Inventory.aggregate([{ $match: inventoryScope(companyId) }, { $group: { _id: null, available: { $sum: { $subtract: ['$onHand', '$reserved'] } } } }]) : [],
    PurchaseOrder.countDocuments(scope),
    PurchaseOrder.countDocuments({ ...scope, status: 'pending_supplier_confirmation' }),
    canReadInventory ? Inventory.find(inventoryScope(companyId)).sort({ updatedAt: -1 }).limit(6).populate('productId', 'name sku unitPrice currency active') : [],
    PurchaseOrder.find(scope).sort({ orderDate: -1 }).limit(5).select(orderFields).populate('buyerCompanyId', 'name mark'),
    hasPermission(user.role, 'supplier:activity:read') ? recentActivity(companyId) : [],
  ]);
  const pendingSupplierApprovals = hasPermission(user.role, 'supplier:approvals:read')
    ? await PurchaseOrder.countDocuments({ ...scope, supplierApprovalStatus: 'pending' }) : null;
  return {
    company: { name: user.company.name, mark: user.company.mark }, user: { displayName: user.displayName, role: user.role },
    metrics: { totalProducts, totalAvailableInventory: canReadInventory ? (inventoryRows[0]?.available ?? 0) : null, incomingOrders, pendingSupplierResponses, pendingSupplierApprovals },
    inventory: inventoryRecords.filter((row) => row.productId?.active).map((row) => ({ id: row.id, product: row.productId.name, sku: row.productId.sku, onHand: row.onHand, reserved: row.reserved, available: row.onHand - row.reserved, unitPrice: row.productId.unitPrice, currency: row.productId.currency, updatedAt: row.updatedAt })),
    incomingOrders: recentOrders.map((order) => ({ id: order.id, orderNumber: order.orderNumber, buyer: order.buyerCompanyId?.name ?? 'Partner', product: order.productName, sku: order.productSku, quantity: order.quantity, requiredBy: order.requiredBy, status: order.status })),
    recentActivity: activity,
  };
}
