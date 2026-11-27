import test from 'node:test';
import assert from 'node:assert/strict';
import { loginCredentialsSchema } from '../src/routes/auth.js';

test('login request accepts a valid workspace context and never accepts role claims', () => {
  const valid = loginCredentialsSchema.safeParse({
    email: 'buyer.admin@apex-motors.test',
    password: 'development-only-password',
    workspaceContext: 'apex-motors',
    remember: false,
  });
  assert.equal(valid.success, true);

  const withRoleClaim = loginCredentialsSchema.safeParse({
    email: 'buyer.admin@apex-motors.test',
    password: 'development-only-password',
    workspaceContext: 'apex-motors',
    role: 'supplier_admin',
    companyId: 'attacker-supplied-id',
  });
  assert.equal(withRoleClaim.success, false);
});

test('login request rejects unknown workspace names and missing passwords', () => {
  assert.equal(loginCredentialsSchema.safeParse({
    email: 'buyer.admin@apex-motors.test',
    password: 'development-only-password',
    workspaceContext: 'other-company',
  }).success, false);

  assert.equal(loginCredentialsSchema.safeParse({
    email: 'buyer.admin@apex-motors.test',
    workspaceContext: 'apex-motors',
  }).success, false);
});
