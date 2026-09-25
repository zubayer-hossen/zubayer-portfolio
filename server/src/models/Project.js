import mongoose from 'mongoose';
import slugPlugin from '../utils/slugPlugin.js';

const seoSchema = new mongoose.Schema({ title: String, description: String, image: String }, { _id: false });

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 140 },
    shortDescription: { type: String, trim: true, maxlength: 300 },
    description: { type: String, trim: true },
    cover: { type: String, trim: true },
    screenshots: [String],
    videoUrl: { type: String, trim: true },
    category: { type: String, trim: true }, // ProjectCategory slug
    technologies: [String],
    tags: [String],
    type: { type: String, trim: true }, // e.g. Full-stack, API, Frontend
    status: { type: String, enum: ['completed', 'in-progress', 'planned', 'archived'], default: 'completed' },
    projectDate: { type: Date, default: Date.now },
    liveUrl: { type: String, trim: true },
    githubUrl: { type: String, trim: true },
    githubMeta: {
      stars: Number,
      forks: Number,
      languages: [String],
      commits: Number,
      syncedAt: Date,
    },
    features: [String],
    problem: String,
    solution: String,
    process: String,
    architecture: String,
    challenges: [String],
    results: String,
    futureImprovements: String,
    caseStudy: {
      enabled: { type: Boolean, default: false },
      research: String,
      planning: String,
      design: String,
      development: String,
      challenges: String,
      solutions: String,
      result: String,
      lessons: String,
      futurePlan: String,
    },
    featured: { type: Boolean, default: false },
    publishStatus: { type: String, enum: ['draft', 'published'], default: 'draft', index: true },
    order: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    demoClicks: { type: Number, default: 0 },
    githubClicks: { type: Number, default: 0 },
    likedBy: { type: [String], select: false, default: [] },
    seo: seoSchema,
    isPlaceholder: { type: Boolean, default: false },
  },
  { timestamps: true }
);
schema.plugin(slugPlugin, { source: 'title' });
schema.index({ title: 'text', shortDescription: 'text', technologies: 'text', tags: 'text' });

export default mongoose.model('Project', schema);
