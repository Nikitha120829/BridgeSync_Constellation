import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { z } from 'zod';
import { config } from '../src/config.js';
import { Company } from '../src/models/Company.js';
import { User } from '../src/models/User.js';
import { Product } from '../src/models/Product.js';
import { Inventory } from '../src/models/Inventory.js';
import { PurchaseOrder } from '../src/models/PurchaseOrder.js';
import { Activity } from '../src/models/Activity.js';

const passwordResult = z.string().min(12).safeParse(process.env.DEMO_USER_PASSWORD);
if (config.isProduction) throw new Error('Demo seed is disabled in production.');
if (!passwordResult.success) throw new Error('Set DEMO_USER_PASSWORD to a value of at least 12 characters in the local .env file.');
const users = [
  { displayName: 'Alex Morgan', email: 'buyer.admin@apex-motors.test', role: 'buyer_admin', company: 'apex-motors' },
  { displayName: 'Priya Shah', email: 'buyer.procurement@apex-motors.test', role: 'buyer_procurement', company: 'apex-motors' },
  { displayName: 'Jordan Lee', email: 'buyer.finance@apex-motors.test', role: 'buyer_finance', company: 'apex-motors' },
  { displayName: 'Taylor Reed', email: 'buyer.approver@apex-motors.test', role: 'buyer_approver', company: 'apex-motors' },
  { displayName: 'Morgan Chen', email: 'supplier.admin@nova-components.test', role: 'supplier_admin', company: 'nova-components' },
  { displayName: 'Sam Rivera', email: 'supplier.operations@nova-components.test', role: 'supplier_operations', company: 'nova-components' },
  { displayName: 'Casey Patel', email: 'supplier.finance@nova-components.test', role: 'supplier_finance', company: 'nova-components' },
  { displayName: 'Jamie Brooks', email: 'supplier.approver@nova-components.test', role: 'supplier_approver', company: 'nova-components' },
];
async function seed() {
  await mongoose.connect(config.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
  const apex = await Company.findOneAndUpdate({ slug: 'apex-motors' }, { $set: { name: 'Apex Motors', slug: 'apex-motors', type: 'buyer', mark: 'AM' } }, { upsert: true, new: true });
  const nova = await Company.findOneAndUpdate({ slug: 'nova-components' }, { $set: { name: 'Nova Components', slug: 'nova-components', type: 'supplier', mark: 'NC' } }, { upsert: true, new: true });
  const companies = { 'apex-motors': apex, 'nova-components': nova };
  const passwordHash = await bcrypt.hash(passwordResult.data, 12);
  const userByEmail = {};
  for (const entry of users) userByEmail[entry.email] = await User.findOneAndUpdate({ email: entry.email }, { $set: { ...entry, companyId: companies[entry.company]._id, passwordHash, active: true } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  const products = [
    { sku: 'NC-EN-440', name: 'Electric drive module', unitPrice: 2450 },
    { sku: 'NC-TR-120', name: 'Transmission assembly', unitPrice: 1180 },
    { sku: 'NC-BR-338', name: 'Brake control module', unitPrice: 420 },
  ];
  const bySku = {};
  for (const product of products) bySku[product.sku] = await Product.findOneAndUpdate({ companyId: nova._id, sku: product.sku }, { $set: { ...product, companyId: nova._id, active: true, currency: 'USD' } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  const stock = [{ sku: 'NC-EN-440', onHand: 1240, reserved: 340 }, { sku: 'NC-TR-120', onHand: 460, reserved: 90 }, { sku: 'NC-BR-338', onHand: 810, reserved: 120 }];
  for (const row of stock) await Inventory.findOneAndUpdate({ companyId: nova._id, productId: bySku[row.sku]._id }, { $setOnInsert: { ...row, companyId: nova._id, productId: bySku[row.sku]._id } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  const now = Date.now();
  const orders = [
    { orderNumber: 'AM-PO-1001', productSku: 'NC-EN-440', quantity: 500, daysAgo: 1, requiredIn: 16, status: 'pending_supplier_confirmation', buyerApprovalStatus: 'not_required', supplierApprovalStatus: 'pending' },
    { orderNumber: 'AM-PO-1002', productSku: 'NC-TR-120', quantity: 120, daysAgo: 3, requiredIn: 12, status: 'confirmed', buyerApprovalStatus: 'pending', supplierApprovalStatus: 'approved' },
    { orderNumber: 'AM-PO-1003', productSku: 'NC-BR-338', quantity: 210, daysAgo: 5, requiredIn: 8, status: 'needs_attention', buyerApprovalStatus: 'pending', supplierApprovalStatus: 'pending' },
    { orderNumber: 'AM-PO-1004', productSku: 'NC-EN-440', quantity: 300, daysAgo: 7, requiredIn: 5, status: 'in_progress', buyerApprovalStatus: 'approved', supplierApprovalStatus: 'approved' },
  ];
  for (const entry of orders) {
    const product = bySku[entry.productSku];
    await PurchaseOrder.findOneAndUpdate({ orderNumber: entry.orderNumber }, { $set: { orderNumber: entry.orderNumber, buyerCompanyId: apex._id, supplierCompanyId: nova._id, productId: product._id, productName: product.name, productSku: product.sku, quantity: entry.quantity, unitPrice: product.unitPrice, currency: 'USD', orderDate: new Date(now - entry.daysAgo * 86400000), requiredBy: new Date(now + entry.requiredIn * 86400000), status: entry.status, buyerApprovalStatus: entry.buyerApprovalStatus, supplierApprovalStatus: entry.supplierApprovalStatus } }, { upsert: true, new: true, setDefaultsOnInsert: true });
  }
  for (const [email, user] of Object.entries(userByEmail)) await Activity.updateOne({ companyId: user.companyId, actorUserId: user._id, action: 'login_success', details: 'Synthetic demo account' }, { $setOnInsert: { companyId: user.companyId, actorUserId: user._id, action: 'login_success', details: 'Synthetic demo account', occurredAt: new Date() } }, { upsert: true });
  process.stdout.write(`Development data seeded for Apex Motors and Nova Components. Companies: 2 | Users: ${users.length} | Products: ${products.length} | Orders: ${orders.length}\n`);
}
seed().catch((error) => { process.stderr.write(`Development seeding failed: ${error.message}\n`); process.exitCode = 1; }).finally(async () => { await mongoose.disconnect(); });
