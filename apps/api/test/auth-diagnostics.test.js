import test from 'node:test';
import assert from 'node:assert/strict';
import { logAuthorizationDenial } from '../src/middleware/auth.js';

test('authorization diagnostics include route identity and omit request secrets', () => {
  let output = '';
  const req = {
    method: 'POST',
    baseUrl: '/api/procurement',
    path: '/orders/secret-order-id/response',
    originalUrl: '/api/procurement/orders/secret-order-id/response?token=query-secret',
    route: { path: '/orders/:orderId/response' },
    headers: { cookie: 'session=secret-cookie', authorization: 'Bearer api-key' },
    body: { password: 'do-not-log-password' },
    user: {
      id: 'user-123',
      role: 'supplier_admin',
      company: { _id: 'company-456', id: 'company-456', type: 'supplier' },
    },
  };

  const diagnostic = logAuthorizationDenial(req, {
    reason: 'company_type_mismatch',
    expectedCompanyType: 'buyer',
  }, (line) => { output += line; return true; });

  assert.deepEqual(diagnostic, {
    event: 'authorization_denied',
    method: 'POST',
    path: '/api/procurement/orders/:orderId/response',
    userId: 'user-123',
    role: 'supplier_admin',
    companyId: 'company-456',
    companyType: 'supplier',
    expectedCompanyType: 'buyer',
    reason: 'company_type_mismatch',
  });
  assert.deepEqual(JSON.parse(output.replace(/^\[BridgeSync API\] /, '').trim()), diagnostic);
  for (const secret of ['query-secret', 'secret-cookie', 'api-key', 'do-not-log-password', 'secret-order-id']) {
    assert.equal(output.includes(secret), false);
  }
});

test('permission diagnostics include the denied permission and use a query-free fallback path', () => {
  let output = '';
  const diagnostic = logAuthorizationDenial({
    method: 'POST',
    baseUrl: '/api/procurement',
    path: '/orders/123/response?token=secret',
    user: {
      id: 'user-123',
      role: 'supplier_finance',
      company: { _id: 'company-456', type: 'supplier' },
    },
  }, {
    reason: 'permission_missing',
    expectedCompanyType: 'supplier',
    requiredPermission: 'supplier:orders:respond',
  }, (line) => { output += line; return true; });

  assert.equal(diagnostic.path, '/api/procurement/orders/123/response');
  assert.equal(diagnostic.role, 'supplier_finance');
  assert.equal(diagnostic.requiredPermission, 'supplier:orders:respond');
  assert.equal(diagnostic.reason, 'permission_missing');
  assert.equal(output.includes('token=secret'), false);
});
