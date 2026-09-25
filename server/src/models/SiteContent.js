import mongoose from 'mongoose';

export const CONTENT_KEYS = ['profile', 'hero', 'about', 'settings', 'seo', 'resume'];

/** Singleton documents (profile, hero, about, settings, seo, resume) keyed by name. */
const schema = new mongoose.Schema(
  {
    key: { type: String, enum: CONTENT_KEYS, required: true, unique: true },
    data: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true, minimize: false }
);

export default mongoose.model('SiteContent', schema);
