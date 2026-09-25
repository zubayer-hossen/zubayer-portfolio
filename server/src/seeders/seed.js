import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { connectDB } from '../config/db.js';
import User from '../models/User.js';
import SiteContent from '../models/SiteContent.js';
import Skill from '../models/Skill.js';
import Service from '../models/Service.js';
import ProjectCategory from '../models/ProjectCategory.js';
import BlogCategory from '../models/BlogCategory.js';
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import SocialLink from '../models/SocialLink.js';
import Announcement from '../models/Announcement.js';
import * as d from './defaultContent.js';

const force = process.argv.includes('--force');
const DEFAULT_PASSWORD = 'Admin@12345678';

async function seedIfEmpty(Model, docs, label) {
  if ((await Model.countDocuments()) > 0) return console.log(`[seed] ${label}: already has data, skipped`);
  for (const doc of docs) await Model.create(doc); // create() so slugs / hooks run
  console.log(`[seed] ${label}: ${docs.length} created`);
}

async function main() {
  await connectDB();

  if (!env.admin.email || !env.admin.password) throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in server/.env');
  if (env.isProd && env.admin.password === DEFAULT_PASSWORD) throw new Error('Refusing to seed production with the default admin password.');

  const admin = await User.findOne({ email: env.admin.email });
  if (!admin) {
    await User.create({ name: env.admin.name, email: env.admin.email, password: env.admin.password, role: 'super_admin' });
    console.log(`[seed] Super Admin created: ${env.admin.email}`);
    if (env.admin.password === DEFAULT_PASSWORD) console.log('[seed] ⚠  You are using the default password — change it in Admin → Security right after your first login.');
  } else console.log('[seed] Super Admin already exists, skipped');

  for (const [key, data] of Object.entries(d.content)) {
    const exists = await SiteContent.findOne({ key });
    if (!exists || force) {
      await SiteContent.findOneAndUpdate({ key }, { data }, { upsert: true, setDefaultsOnInsert: true });
      console.log(`[seed] content "${key}" ${exists ? 'reset (--force)' : 'created'}`);
    }
  }

  await seedIfEmpty(Skill, d.skills, 'skills');
  await seedIfEmpty(Service, d.services, 'services');
  await seedIfEmpty(ProjectCategory, d.projectCategories, 'project categories');
  await seedIfEmpty(BlogCategory, d.blogCategories, 'blog categories');
  await seedIfEmpty(Project, d.projects, 'sample projects');
  await seedIfEmpty(Blog, d.blogs, 'sample articles');
  await seedIfEmpty(SocialLink, d.socialLinks, 'social links');
  await seedIfEmpty(Announcement, [d.announcement], 'announcement');

  console.log('\n[seed] Done. Start the app with: npm run dev\n');
  await mongoose.connection.close();
}

main().catch(async (e) => {
  console.error('[seed] failed:', e.message);
  await mongoose.connection.close().catch(() => {});
  process.exit(1);
});
