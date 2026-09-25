import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import Skill from '../models/Skill.js';
import Service from '../models/Service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ok } from './crud.controller.js';
import { blogPublicFilter } from './blog.controller.js';

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const search = asyncHandler(async (req, res) => {
  const q = typeof req.query.q === 'string' ? req.query.q.trim().slice(0, 60) : '';
  if (q.length < 2) return ok(res, { projects: [], blogs: [], skills: [], services: [] });
  const rx = new RegExp(esc(q), 'i');
  const [projects, blogs, skills, services] = await Promise.all([
    Project.find({ publishStatus: 'published', $or: [{ title: rx }, { shortDescription: rx }, { technologies: rx }, { tags: rx }] })
      .select('title slug shortDescription').limit(5).lean(),
    Blog.find({ $and: [blogPublicFilter(), { $or: [{ title: rx }, { excerpt: rx }, { tags: rx }] }] })
      .select('title slug excerpt').limit(5).lean(),
    Skill.find({ isActive: { $ne: false }, $or: [{ name: rx }, { category: rx }] }).select('name category').limit(5).lean(),
    Service.find({ isActive: { $ne: false }, $or: [{ title: rx }, { description: rx }] }).select('title description').limit(5).lean(),
  ]);
  ok(res, { projects, blogs, skills, services });
});
