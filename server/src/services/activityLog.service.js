import ActivityLog from '../models/ActivityLog.js';

export async function logActivity(req, action, entity, doc, summary) {
  try {
    await ActivityLog.create({
      user: req.user?._id,
      userName: req.user?.name,
      action,
      entity,
      entityId: doc?._id ? String(doc._id) : undefined,
      summary: summary ? String(summary).slice(0, 200) : undefined,
    });
  } catch (e) {
    console.error('[activity-log]', e.message);
  }
}
