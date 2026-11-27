import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, index: true },
  type: { type: String, enum: ['buyer', 'supplier'], required: true, index: true },
  mark: { type: String, required: true, minlength: 2, maxlength: 2 },
}, { timestamps: true });

export const Company = mongoose.model('Company', companySchema);
