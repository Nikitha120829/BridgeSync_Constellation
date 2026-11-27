import mongoose from 'mongoose';
const purchaseOrderSchema = new mongoose.Schema({
  orderNumber: { type: String, required: true, trim: true },
  buyerCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  supplierCompanyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: null },
  productName: { type: String, required: true, trim: true },
  productSku: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, min: 1 },
  unitPrice: { type: Number, required: true, min: 0 },
  currency: { type: String, enum: ['USD'], default: 'USD' },
  orderDate: { type: Date, required: true },
  requiredBy: { type: Date, required: true },
  status: { type: String, enum: ['pending_supplier_confirmation', 'confirmed', 'in_progress', 'needs_attention', 'rejected', 'complete'], required: true, index: true },
  buyerApprovalStatus: { type: String, enum: ['not_required', 'pending', 'approved'], default: 'not_required' },
  supplierApprovalStatus: { type: String, enum: ['not_required', 'pending', 'approved'], default: 'not_required' },
}, { timestamps: true });
purchaseOrderSchema.index({ buyerCompanyId: 1, orderDate: -1 });
purchaseOrderSchema.index({ supplierCompanyId: 1, orderDate: -1 });
purchaseOrderSchema.index({ orderNumber: 1 }, { unique: true });
export const PurchaseOrder = mongoose.model('PurchaseOrder', purchaseOrderSchema);
