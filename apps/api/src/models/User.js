import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  displayName: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, lowercase: true, trim: true, unique: true, index: true },
  passwordHash: { type: String, required: true, select: false },
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  role: {
    type: String,
    enum: [
      'buyer_admin', 'buyer_procurement', 'buyer_finance', 'buyer_approver',
      'supplier_admin', 'supplier_operations', 'supplier_finance', 'supplier_approver',
    ],
    required: true,
    index: true,
  },
  active: { type: Boolean, default: true, index: true },
}, { timestamps: true });

userSchema.index({ companyId: 1, role: 1 });

export const User = mongoose.model('User', userSchema);
