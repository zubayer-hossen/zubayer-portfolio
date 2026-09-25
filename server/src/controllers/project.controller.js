import Project from '../models/Project.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { visitorHash, isBot } from '../utils/visitor.js';
import { recordEvent } from '../services/analytics.service.js';
import { fetchRepoMeta } from '../services/github.service.js';
import { logActivity } from '../services/activityLog.service.js';
import { ok } from './crud.controller.js';

const PUB = { publishStatus: 'published' };
const LIST_SELECT =
  'title slug shortDescription cover screenshots category technologies tags featured status type liveUrl githubUrl projectDate views likes isPlaceholder caseStudy.enabled';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const SORTS = {
  latest: { projectDate: -1, createdAt: -1 },
  oldest: { projectDate: 1 },
  popular: { likes: -1, views: -1 },
  views: { views: -1 },
  title: { title: 1 },
  featured: { featured: -1, projectDate: -1 },
};

export const list = asyncHandler(async (req, res) => {
  const { q, category, technology, status, type, featured, tag, sort = 'latest', caseStudy } = req.query;
  const and = [PUB];
  if (typeof category === 'string' && category) and.push({ category });
  if (typeof technology === 'string' && technology) and.push({ technologies: new RegExp(`^${esc(technology)}$`, 'i') });
  if (typeof status === 'string' && status) and.push({ status });
  if (typeof type === 'string' && type) and.push({ type });
  if (typeof tag === 'string' && tag) and.push({ tags: tag });
  if (featured === 'true') and.push({ featured: true });
  if (caseStudy === 'true') and.push({ 'caseStudy.enabled': true });
  if (typeof q === 'string' && q.trim()) {
    const rx = new RegExp(esc(q.trim().slice(0, 80)), 'i');
    and.push({ $or: [{ title: rx }, { shortDescription: rx }, { technologies: rx }, { tags: rx }] });
  }
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 9));
  const filter = { $and: and };
  const [items, total] = await Promise.all([
    Project.find(filter)
      .select(LIST_SELECT)
      .sort(SORTS[sort] || SORTS.latest)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Project.countDocuments(filter),
  ]);
  ok(res, { items, pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } });
});

export const facets = asyncHandler(async (_req, res) => {
  const [categories, technologies, statuses, types] = await Promise.all([
    Project.aggregate([{ $match: PUB }, { $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Project.aggregate([{ $match: PUB }, { $unwind: '$technologies' }, { $group: { _id: '$technologies', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Project.distinct('status', PUB),
    Project.distinct('type', PUB),
  ]);
  ok(res, {
    categories: categories.filter((c) => c._id).map((c) => ({ slug: c._id, count: c.count })),
    technologies: technologies.map((t) => ({ name: t._id, count: t.count })),
    statuses,
    types: types.filter(Boolean),
  });
});

export const getBySlug = asyncHandler(async (req, res) => {
  const doc = await Project.findOne({ slug: req.params.slug, ...PUB }).select('+likedBy').lean();
  if (!doc) throw new ApiError(404, 'Project not found');
  const liked = (doc.likedBy || []).includes(visitorHash(req));
  delete doc.likedBy;
  const related = await Project.find({
    ...PUB,
    _id: { $ne: doc._id },
    $or: [{ category: doc.category }, { technologies: { $in: doc.technologies || [] } }],
  })
    .select(LIST_SELECT)
    .sort({ featured: -1, projectDate: -1 })
    .limit(3)
    .lean();
  ok(res, { ...doc, liked, related });
});

export const registerView = asyncHandler(async (req, res) => {
  if (isBot(req)) return ok(res, {});
  const doc = await Project.findOneAndUpdate({ slug: req.params.slug, ...PUB }, { $inc: { views: 1 } }, { new: true }).select('title slug views');
  if (!doc) throw new ApiError(404, 'Project not found');
  recordEvent(req, { type: 'project_view', targetType: 'project', targetId: String(doc._id), targetSlug: doc.slug, targetTitle: doc.title });
  ok(res, { views: doc.views });
});

export const toggleLike = asyncHandler(async (req, res) => {
  const vh = visitorHash(req);
  const doc = await Project.findOne({ slug: req.params.slug, ...PUB }).select('+likedBy title slug likes');
  if (!doc) throw new ApiError(404, 'Project not found');
  const has = doc.likedBy.includes(vh);
  await Project.updateOne({ _id: doc._id }, has ? { $pull: { likedBy: vh }, $inc: { likes: -1 } } : { $addToSet: { likedBy: vh }, $inc: { likes: 1 } });
  if (!has) recordEvent(req, { type: 'project_like', targetType: 'project', targetId: String(doc._id), targetSlug: doc.slug, targetTitle: doc.title });
  ok(res, { liked: !has, likes: Math.max(0, doc.likes + (has ? -1 : 1)) });
});

export const registerClick = asyncHandler(async (req, res) => {
  const kind = req.body?.kind;
  if (!['demo', 'github'].includes(kind)) throw new ApiError(400, 'Unknown click type.');
  if (isBot(req)) return ok(res, {});
  const field = kind === 'demo' ? 'demoClicks' : 'githubClicks';
  const doc = await Project.findOneAndUpdate({ slug: req.params.slug, ...PUB }, { $inc: { [field]: 1 } }, { new: true }).select('title slug');
  if (!doc) throw new ApiError(404, 'Project not found');
  recordEvent(req, { type: kind === 'demo' ? 'demo_click' : 'github_click', targetType: 'project', targetId: String(doc._id), targetSlug: doc.slug, targetTitle: doc.title });
  ok(res, {});
});

/** Admin: pulls stars/forks/languages/commits from the public GitHub API. */
export const syncGithub = asyncHandler(async (req, res) => {
  const doc = await Project.findById(req.params.id);
  if (!doc) throw new ApiError(404, 'Project not found');
  if (!doc.githubUrl) throw new ApiError(400, 'Add a GitHub URL to this project first.');
  doc.githubMeta = await fetchRepoMeta(doc.githubUrl);
  await doc.save();
  await logActivity(req, 'updated', 'Project', doc, `Synced GitHub data for ${doc.title}`);
  ok(res, doc);
});
