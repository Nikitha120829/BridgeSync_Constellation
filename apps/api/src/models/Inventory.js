import mongoose from 'mongoose';
const inventorySchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  onHand: { type: Number, required: true, min: 0, default: 0 },
  reserved: { type: Number, required: true, min: 0, default: 0, validate: { validator(value) { return value <= this.onHand; }, message: 'Reserved stock cannot exceed on-hand stock.' } },
}, { timestamps: true });
inventorySchema.index({ companyId: 1, productId: 1 }, { unique: true });
inventorySchema.virtual('available').get(function available() { return this.onHand - this.reserved; });
export const Inventory = mongoose.model('Inventory', inventorySchema);
