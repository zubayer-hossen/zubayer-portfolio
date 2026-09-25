import { asyncHandler } from '../utils/asyncHandler.js';
import { buildKnowledgeBase } from '../services/knowledge.service.js';
import SiteContent from '../models/SiteContent.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Certification from '../models/Certification.js';
import Project from '../models/Project.js';
import ProjectCategory from '../models/ProjectCategory.js';
import Blog from '../models/Blog.js';
import BlogCategory from '../models/BlogCategory.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import SocialLink from '../models/SocialLink.js';
import Announcement from '../models/Announcement.js';
import { logActivity } from '../services/activityLog.service.js';
import { ok } from './crud.controller.js';

/** AI assistant integration point: plain-text knowledge base of the public content. */
export const assistantContext = asyncHandler(async (_req, res) => ok(res, { text: await buildKnowledgeBase() }));

/** Full JSON backup (Super Admin). Import is intentionally left for a future release. */
export const exportAll = asyncHandler(async (req, res) => {
  const sets = { SiteContent, Skill, Experience, Education, Certification, Project, ProjectCategory, Blog, BlogCategory, Service, Testimonial, SocialLink, Announcement };
  const out = { exportedAt: new Date().toISOString(), version: 1 };
  for (const [name, Model] of Object.entries(sets)) out[name] = await Model.find().lean();
  await logActivity(req, 'exported', 'Backup', null, 'Downloaded JSON backup');
  res.set('Content-Disposition', `attachment; filename="portfolio-backup-${new Date().toISOString().slice(0, 10)}.json"`);
  res.json(out);
});
