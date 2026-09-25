import Blog from '../models/Blog.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { isBot } from '../utils/visitor.js';
import { recordEvent } from '../services/analytics.service.js';
import { ok } from './crud.controller.js';

/** Published posts, plus scheduled posts whose time has come (no cron needed). */
export const blogPublicFilter = () => ({
  $or: [{ status: 'published' }, { status: 'scheduled', scheduledAt: { $lte: new Date() } }],
});

const LIST_SELECT = '-content';
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const SORTS = { latest: { publishedAt: -1 }, popular: { views: -1, publishedAt: -1 }, oldest: { publishedAt: 1 } };

export const list = asyncHandler(async (req, res) => {
  const { q, category, tag, featured, sort = 'latest' } = req.query;
  const and = [blogPublicFilter()];
  if (typeof category === 'string' && category) and.push({ category });
  if (typeof tag === 'string' && tag) and.push({ tags: tag });
  if (featured === 'true') and.push({ featured: true });
  if (typeof q === 'string' && q.trim()) {
    const rx = new RegExp(esc(q.trim().slice(0, 80)), 'i');
    and.push({ $or: [{ title: rx }, { excerpt: rx }, { tags: rx }] });
  }
  const page = Math.max(1, parseInt(req.query.page, 10) || 1);
  const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 9));
  const filter = { $and: and };
  const [items, total] = await Promise.all([
    Blog.find(filter).select(LIST_SELECT).sort(SORTS[sort] || SORTS.latest).skip((page - 1) * limit).limit(limit).lean(),
    Blog.countDocuments(filter),
  ]);
  ok(res, { items, pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } });
});

export const facets = asyncHandler(async (_req, res) => {
  const match = { $match: blogPublicFilter() };
  const [categories, tags] = await Promise.all([
    Blog.aggregate([match, { $group: { _id: '$category', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
    Blog.aggregate([match, { $unwind: '$tags' }, { $group: { _id: '$tags', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 30 }]),
  ]);
  ok(res, {
    categories: categories.filter((c) => c._id).map((c) => ({ slug: c._id, count: c.count })),
    tags: tags.map((t) => ({ name: t._id, count: t.count })),
  });
});

export const getBySlug = asyncHandler(async (req, res) => {
  const pub = blogPublicFilter();
  const doc = await Blog.findOne({ $and: [{ slug: req.params.slug }, pub] }).lean();
  if (!doc) throw new ApiError(404, 'Article not found');
  const [related, prev, next] = await Promise.all([
    Blog.find({ $and: [pub, { _id: { $ne: doc._id } }, { $or: [{ category: doc.category }, { tags: { $in: doc.tags || [] } }] }] })
      .select(LIST_SELECT).sort({ publishedAt: -1 }).limit(3).lean(),
    Blog.findOne({ $and: [pub, { publishedAt: { $lt: doc.publishedAt } }] }).select('title slug').sort({ publishedAt: -1 }).lean(),
    Blog.findOne({ $and: [pub, { publishedAt: { $gt: doc.publishedAt } }] }).select('title slug').sort({ publishedAt: 1 }).lean(),
  ]);
  ok(res, { ...doc, related, prev, next });
});

export const registerView = asyncHandler(async (req, res) => {
  if (isBot(req)) return ok(res, {});
  const doc = await Blog.findOneAndUpdate({ $and: [{ slug: req.params.slug }, blogPublicFilter()] }, { $inc: { views: 1 } }, { new: true }).select('title slug views');
  if (!doc) throw new ApiError(404, 'Article not found');
  recordEvent(req, { type: 'blog_view', targetType: 'blog', targetId: String(doc._id), targetSlug: doc.slug, targetTitle: doc.title });
  ok(res, { views: doc.views });
});
