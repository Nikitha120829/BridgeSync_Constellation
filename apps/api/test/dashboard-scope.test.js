import test from 'node:test';
import assert from 'node:assert/strict';
import { activityScope, buyerOrderScope, inventoryScope, productScope, supplierOrderScope } from '../src/services/dashboardScope.js';

test('dashboard database selectors always bind records to the authenticated company', () => {
  const apexCompanyId = 'apex-company-id';
  const novaCompanyId = 'nova-company-id';

  assert.deepEqual(buyerOrderScope(apexCompanyId), { buyerCompanyId: apexCompanyId });
  assert.deepEqual(supplierOrderScope(novaCompanyId), { supplierCompanyId: novaCompanyId });
  assert.deepEqual(productScope(novaCompanyId), { companyId: novaCompanyId, active: true });
  assert.deepEqual(inventoryScope(novaCompanyId), { companyId: novaCompanyId });
  assert.deepEqual(activityScope(apexCompanyId), { companyId: apexCompanyId });
  assert.notDeepEqual(buyerOrderScope(apexCompanyId), buyerOrderScope(novaCompanyId));
});
