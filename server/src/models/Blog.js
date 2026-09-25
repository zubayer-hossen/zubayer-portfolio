import mongoose from 'mongoose';
import slugPlugin from '../utils/slugPlugin.js';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 160 },
    excerpt: { type: String, trim: true, maxlength: 400 },
    content: { type: String, default: '' }, // Markdown
    cover: { type: String, trim: true },
    category: { type: String, trim: true }, // BlogCategory slug
    tags: [String],
    author: { type: String, trim: true, default: 'Zubayer Hossen' },
    readingTime: { type: Number, default: 1 },
    status: { type: String, enum: ['draft', 'scheduled', 'published'], default: 'draft', index: true },
    scheduledAt: Date,
    publishedAt: Date,
    featured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    seo: { title: String, description: String, image: String },
    isPlaceholder: { type: Boolean, default: false },
  },
  { timestamps: true }
);
schema.plugin(slugPlugin, { source: 'title' });
schema.index({ title: 'text', excerpt: 'text', tags: 'text' });

schema.pre('validate', function (next) {
  if (this.status === 'scheduled' && !this.scheduledAt) this.invalidate('scheduledAt', 'Choose a date and time for scheduled posts');
  next();
});

schema.pre('save', function (next) {
  const words = (this.content || '').trim().split(/\s+/).filter(Boolean).length;
  this.readingTime = Math.max(1, Math.ceil(words / 200));
  if (this.status === 'published' && !this.publishedAt) this.publishedAt = new Date();
  if (this.status === 'scheduled') this.publishedAt = this.scheduledAt;
  next();
});

export default mongoose.model('Blog', schema);
