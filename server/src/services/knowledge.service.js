import SiteContent from '../models/SiteContent.js';
import Skill from '../models/Skill.js';
import Project from '../models/Project.js';
import Service from '../models/Service.js';
import Blog from '../models/Blog.js';

/**
 * AI-assistant integration point.
 * Returns a plain-text knowledge base of the public portfolio content. A future chat
 * assistant can send this as context to an LLM so it can answer visitor questions.
 */
export async function buildKnowledgeBase() {
  const [contents, skills, projects, services, blogs] = await Promise.all([
    SiteContent.find().lean(),
    Skill.find({ isActive: { $ne: false } }).lean(),
    Project.find({ publishStatus: 'published' }).select('title shortDescription technologies liveUrl githubUrl').lean(),
    Service.find({ isActive: { $ne: false } }).lean(),
    Blog.find({ status: 'published' }).select('title excerpt').limit(20).lean(),
  ]);
  const c = Object.fromEntries(contents.map((x) => [x.key, x.data]));
  return [
    `# ${c.profile?.name || ''} — ${c.profile?.title || ''}`,
    c.about?.bio || '',
    `## Skills\n${skills.map((s) => `- ${s.name} (${s.category})`).join('\n')}`,
    `## Projects\n${projects.map((p) => `- ${p.title}: ${p.shortDescription || ''} [${(p.technologies || []).join(', ')}]`).join('\n')}`,
    `## Services\n${services.map((s) => `- ${s.title}: ${s.description || ''}`).join('\n')}`,
    `## Articles\n${blogs.map((b) => `- ${b.title}: ${b.excerpt || ''}`).join('\n')}`,
  ].join('\n\n');
}
