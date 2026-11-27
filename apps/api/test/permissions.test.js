import test from 'node:test';
import assert from 'node:assert/strict';
import { hasPermission, permissionsForRole, roleCompanyType } from '../src/permissions.js';
import { requireCompanyType, requirePermission } from '../src/middleware/auth.js';
function responseRecorder() { return { statusCode: 200, body: null, status(code) { this.statusCode = code; return this; }, json(body) { this.body = body; return this; } }; }
test('roles receive only their server-defined company permissions', () => {
  assert.equal(roleCompanyType('buyer_procurement'), 'buyer');
  assert.equal(roleCompanyType('supplier_operations'), 'supplier');
  assert.equal(roleCompanyType('unknown'), null);
  assert.equal(hasPermission('buyer_admin', 'buyer:dashboard:view'), true);
  assert.equal(hasPermission('buyer_finance', 'buyer:approvals:read'), false);
  assert.equal(hasPermission('supplier_operations', 'supplier:inventory:read'), true);
  assert.equal(hasPermission('supplier_finance', 'supplier:inventory:read'), false);
  assert.deepEqual(permissionsForRole('unknown'), []);
});
test('company middleware rejects cross-company dashboard access', () => {
  const req = { user: { company: { type: 'supplier' } } }; const res = responseRecorder(); let continued = false;
  requireCompanyType('buyer')(req, res, () => { continued = true; });
  assert.equal(res.statusCode, 403); assert.equal(res.body.error.code, 'ACCESS_DENIED'); assert.equal(continued, false);
});
test('permission middleware rejects actions not assigned to the authenticated role', () => {
  const req = { user: { role: 'supplier_finance', permissions: permissionsForRole('supplier_finance') } }; const res = responseRecorder(); let continued = false;
  requirePermission('supplier:inventory:read')(req, res, () => { continued = true; });
  assert.equal(res.statusCode, 403); assert.equal(continued, false);
});
