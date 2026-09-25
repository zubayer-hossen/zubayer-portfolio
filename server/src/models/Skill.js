import mongoose from 'mongoose';

export const SKILL_CATEGORIES = ['Frontend', 'Backend', 'Database', 'Programming', 'Tools', 'DevOps', 'Design', 'Other'];

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    category: { type: String, enum: SKILL_CATEGORIES, default: 'Other' },
    level: { type: Number, min: 0, max: 100, default: 50 },
    years: { type: Number, min: 0, max: 50 },
    description: { type: String, trim: true, maxlength: 400 },
    iconSlug: { type: String, trim: true }, // simple-icons slug e.g. "react"
    iconUrl: { type: String, trim: true },
    featured: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    isPlaceholder: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model('Skill', schema);
