export const buyerOrderScope = (companyId) => ({ buyerCompanyId: companyId });
export const supplierOrderScope = (companyId) => ({ supplierCompanyId: companyId });
export const productScope = (companyId) => ({ companyId, active: true });
export const inventoryScope = (companyId) => ({ companyId });
export const activityScope = (companyId) => ({ companyId });
