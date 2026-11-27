import mongoose from 'mongoose';

const activitySchema = new mongoose.Schema({
  companyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true, index: true },
  actorUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  action: { type: String, required: true, enum: ['login_success', 'logout', 'authorization_denied'], index: true },
  details: { type: String, maxlength: 120, default: '' },
  occurredAt: { type: Date, default: Date.now, index: true },
}, { timestamps: false });
activitySchema.index({ companyId: 1, occurredAt: -1 });
export const Activity = mongoose.model('Activity', activitySchema);
