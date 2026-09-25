import AnalyticsEvent from '../models/AnalyticsEvent.js';
import ContactMessage from '../models/ContactMessage.js';
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import Skill from '../models/Skill.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { recordEvent } from '../services/analytics.service.js';
import { ok } from './crud.controller.js';

export const track = asyncHandler(async (req, res) => {
  await recordEvent(req, { type: 'pageview', path: req.body.path, referrer: req.body.referrer });
  res.status(204).end();
});

const RANGES = { today: 1, '7d': 7, '30d': 30, '90d': 90, '1y': 365 };

export const summary = asyncHandler(async (req, res) => {
  const range = req.query.range || '30d';
  let since = null;
  if (range === 'today') {
    since = new Date();
    since.setHours(0, 0, 0, 0);
  } else if (RANGES[range]) since = new Date(Date.now() - RANGES[range] * 86400000);
  const match = since ? { createdAt: { $gte: since } } : {};

  const top = (type) =>
    AnalyticsEvent.aggregate([
      { $match: { ...match, type } },
      { $group: { _id: '$targetId', title: { $last: '$targetTitle' }, slug: { $last: '$targetSlug' }, count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
    ]);

  const [byType, visitors, series, topProjects, topBlogs, messages, unread, projects, blogs, drafts, sample] = await Promise.all([
    AnalyticsEvent.aggregate([{ $match: match }, { $group: { _id: '$type', count: { $sum: 1 } } }]),
    AnalyticsEvent.distinct('visitorHash', { ...match, type: 'pageview' }),
    AnalyticsEvent.aggregate([
      { $match: { ...match, type: { $in: ['pageview', 'project_view', 'blog_view'] } } },
      { $group: { _id: { d: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, t: '$type' }, count: { $sum: 1 } } },
    ]),
    top('project_view'),
    top('blog_view'),
    ContactMessage.countDocuments(match),
    ContactMessage.countDocuments({ status: 'new' }),
    Project.countDocuments(),
    Blog.countDocuments(),
    Promise.all([Project.countDocuments({ publishStatus: 'draft' }), Blog.countDocuments({ status: 'draft' })]),
    Promise.all([Project.countDocuments({ isPlaceholder: true }), Blog.countDocuments({ isPlaceholder: true }), Skill.countDocuments({ isPlaceholder: true })]),
  ]);

  const totals = Object.fromEntries(byType.map((t) => [t._id, t.count]));
  const days = {};
  for (const row of series) {
    days[row._id.d] ||= { date: row._id.d, pageview: 0, project_view: 0, blog_view: 0 };
    days[row._id.d][row._id.t] = row.count;
  }

  ok(res, {
    range,
    totals: {
      visitors: visitors.length,
      pageviews: totals.pageview || 0,
      projectViews: totals.project_view || 0,
      blogViews: totals.blog_view || 0,
      demoClicks: totals.demo_click || 0,
      githubClicks: totals.github_click || 0,
      likes: totals.project_like || 0,
      messages,
    },
    series: Object.values(days).sort((a, b) => a.date.localeCompare(b.date)),
    topProjects,
    topBlogs,
    counts: { unreadMessages: unread, projects, blogs, draftProjects: drafts[0], draftBlogs: drafts[1] },
    sampleContent: { projects: sample[0], blogs: sample[1], skills: sample[2] },
  });
});
