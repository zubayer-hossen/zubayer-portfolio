import SiteContent, { CONTENT_KEYS } from '../models/SiteContent.js';
import SocialLink from '../models/SocialLink.js';
import Announcement from '../models/Announcement.js';
import Project from '../models/Project.js';
import Skill from '../models/Skill.js';
import Blog from '../models/Blog.js';
import Certification from '../models/Certification.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { logActivity } from '../services/activityLog.service.js';
import { ok } from './crud.controller.js';
import { blogPublicFilter } from './blog.controller.js';

export const announcementFilter = () => {
  const now = new Date();
  return {
    isActive: true,
    $and: [
      { $or: [{ startsAt: null }, { startsAt: { $exists: false } }, { startsAt: { $lte: now } }] },
      { $or: [{ endsAt: null }, { endsAt: { $exists: false } }, { endsAt: { $gte: now } }] },
    ],
  };
};

/** One cached request that hydrates the whole public shell (nav, hero, footer, theme, stats...). */
export const getSite = asyncHandler(async (_req, res) => {
  const [contents, socialLinks, announcement, projects, skills, blogs, certifications] = await Promise.all([
    SiteContent.find().lean(),
    SocialLink.find({ isActive: { $ne: false } }).sort({ order: 1 }).lean(),
    Announcement.findOne(announcementFilter()).sort({ createdAt: -1 }).lean(),
    Project.countDocuments({ publishStatus: 'published' }),
    Skill.countDocuments({ isActive: { $ne: false } }),
    Blog.countDocuments(blogPublicFilter()),
    Certification.countDocuments({ isActive: { $ne: false } }),
  ]);
  const byKey = Object.fromEntries(contents.map((c) => [c.key, c.data]));
  const data = Object.fromEntries(CONTENT_KEYS.map((k) => [k, byKey[k] || {}]));
  res.set('Cache-Control', 'public, max-age=0, s-maxage=60, stale-while-revalidate=300');
  ok(res, { ...data, socialLinks, announcement, counts: { projects, skills, blogs, certifications } });
});

export const getContent = asyncHandler(async (req, res) => {
  const { key } = req.params;
  if (!CONTENT_KEYS.includes(key)) throw new ApiError(404, 'Unknown content section.');
  const doc = await SiteContent.findOne({ key }).lean();
  ok(res, doc?.data || {});
});

export const putContent = asyncHandler(async (req, res) => {
  const { key } = req.params;
  if (!CONTENT_KEYS.includes(key)) throw new ApiError(404, 'Unknown content section.');
  if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) throw new ApiError(400, 'Invalid content.');
  const doc = await SiteContent.findOneAndUpdate({ key }, { data: req.body }, { upsert: true, new: true, setDefaultsOnInsert: true });
  await logActivity(req, 'updated', 'Content', doc, `Updated ${key}`);
  ok(res, doc.data);
});
