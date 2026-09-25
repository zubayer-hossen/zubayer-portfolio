import mongoose from 'mongoose';

export const EVENT_TYPES = ['pageview', 'project_view', 'blog_view', 'demo_click', 'github_click', 'project_like', 'contact_submit'];

const schema = new mongoose.Schema({
  type: { type: String, enum: EVENT_TYPES, required: true, index: true },
  targetType: String,
  targetId: String,
  targetSlug: String,
  targetTitle: String,
  path: String,
  referrer: String,
  visitorHash: String,
  device: String,
  createdAt: { type: Date, default: Date.now, index: true, expires: 60 * 60 * 24 * 730 }, // keep 2 years
});

export default mongoose.model('AnalyticsEvent', schema);
