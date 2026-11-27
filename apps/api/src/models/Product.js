import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  sku: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  unitPrice: { type: Number, required: true, min: 0 },
  currency: { type: String, enum: ['USD'], default: 'USD' },
  active: { type: Boolean, default: true },
}, { timestamps: true });

productSchema.index({ companyId: 1, sku: 1 }, { unique: true });

export const Product = mongoose.model('Product', productSchema);
