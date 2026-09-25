import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import SiteContent from '../models/SiteContent.js';
import { env } from '../config/env.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { blogPublicFilter } from './blog.controller.js';

const xml = (s) => String(s).replace(/[<>&'"]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;' })[c]);
const attr = xml;

export const sitemap = asyncHandler(async (_req, res) => {
  const [projects, blogs] = await Promise.all([
    Project.find({ publishStatus: 'published' }).select('slug updatedAt').lean(),
    Blog.find(blogPublicFilter()).select('slug updatedAt').lean(),
  ]);
  const base = env.CLIENT_URL;
  const urls = [
    ...['', '/about', '/skills', '/projects', '/experience', '/blog', '/services', '/contact', '/resume'].map((p) => ({ loc: base + p })),
    ...projects.map((p) => ({ loc: `${base}/projects/${p.slug}`, lastmod: p.updatedAt })),
    ...blogs.map((b) => ({ loc: `${base}/blog/${b.slug}`, lastmod: b.updatedAt })),
  ];
  res.type('application/xml').send(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
      .map((u) => `  <url><loc>${xml(u.loc)}</loc>${u.lastmod ? `<lastmod>${new Date(u.lastmod).toISOString()}</lastmod>` : ''}</url>`)
      .join('\n')}\n</urlset>`
  );
});

export const robots = (_req, res) =>
  res.type('text/plain').send(`User-agent: *\nAllow: /\nDisallow: /admin\nDisallow: /preview\n\nSitemap: ${env.CLIENT_URL}/sitemap.xml\n`);

/**
 * Open Graph landing page. Social crawlers do not run JavaScript, so shares point here:
 * crawlers read the meta tags, people are redirected to the real page.
 */
export const openGraph = asyncHandler(async (req, res) => {
  const { type, slug } = req.params;
  const seo = (await SiteContent.findOne({ key: 'seo' }).lean())?.data || {};
  const site = (await SiteContent.findOne({ key: 'settings' }).lean())?.data || {};
  let doc;
  let path;
  if (type === 'project') {
    doc = await Project.findOne({ slug, publishStatus: 'published' }).lean();
    path = `/projects/${slug}`;
  } else if (type === 'blog') {
    doc = await Blog.findOne({ $and: [{ slug }, blogPublicFilter()] }).lean();
    path = `/blog/${slug}`;
  } else throw new ApiError(404, 'Not found');
  if (!doc) throw new ApiError(404, 'Not found');

  const title = doc.seo?.title || doc.title;
  const description = doc.seo?.description || doc.shortDescription || doc.excerpt || seo.description || '';
  const image = doc.seo?.image || doc.cover || seo.ogImage || '';
  const url = env.CLIENT_URL + path;
  res.type('html').send(`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${xml(title)}</title>
<meta name="description" content="${attr(description)}">
<link rel="canonical" href="${attr(url)}">
<meta property="og:type" content="${type === 'blog' ? 'article' : 'website'}">
<meta property="og:site_name" content="${attr(site.siteName || '')}">
<meta property="og:title" content="${attr(title)}">
<meta property="og:description" content="${attr(description)}">
<meta property="og:url" content="${attr(url)}">
${image ? `<meta property="og:image" content="${attr(image)}">` : ''}
<meta name="twitter:card" content="${image ? 'summary_large_image' : 'summary'}">
<meta name="twitter:title" content="${attr(title)}">
<meta name="twitter:description" content="${attr(description)}">
${image ? `<meta name="twitter:image" content="${attr(image)}">` : ''}
<meta http-equiv="refresh" content="0;url=${attr(url)}"></head>
<body><p><a href="${attr(url)}">Continue to ${xml(title)}</a></p></body></html>`);
});
