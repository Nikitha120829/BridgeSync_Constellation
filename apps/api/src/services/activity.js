import { Activity } from '../models/Activity.js';

export function recordActivity({ companyId, userId, action, details = '' }) {
  return Activity.create({
    companyId,
    actorUserId: userId,
    action,
    details,
    recordType: 'user',
    recordId: userId,
  });
}
