const permissionsByRole = {
  buyer_admin: ['buyer:dashboard:view', 'buyer:orders:read', 'buyer:approvals:read', 'buyer:activity:read'],
  buyer_procurement: ['buyer:dashboard:view', 'buyer:orders:read', 'buyer:activity:read'],
  buyer_finance: ['buyer:dashboard:view', 'buyer:orders:read', 'buyer:activity:read'],
  buyer_approver: ['buyer:dashboard:view', 'buyer:orders:read', 'buyer:approvals:read', 'buyer:activity:read'],
  supplier_admin: ['supplier:dashboard:view', 'supplier:inventory:read', 'supplier:orders:read', 'supplier:approvals:read', 'supplier:activity:read'],
  supplier_operations: ['supplier:dashboard:view', 'supplier:inventory:read', 'supplier:orders:read', 'supplier:activity:read'],
  supplier_finance: ['supplier:dashboard:view', 'supplier:orders:read', 'supplier:activity:read'],
  supplier_approver: ['supplier:dashboard:view', 'supplier:inventory:read', 'supplier:orders:read', 'supplier:approvals:read', 'supplier:activity:read'],
};

export function permissionsForRole(role) { return permissionsByRole[role] ?? []; }
export function hasPermission(role, permission) { return permissionsForRole(role).includes(permission); }
export function roleCompanyType(role) {
  if (role.startsWith('buyer_')) return 'buyer';
  if (role.startsWith('supplier_')) return 'supplier';
  return null;
}
