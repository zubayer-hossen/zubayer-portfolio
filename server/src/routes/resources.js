import { crud } from '../controllers/crud.controller.js';
import { authorize } from '../middleware/auth.js';
import { ADMINS, ROLES, STAFF } from '../constants/roles.js';
import { ApiError } from '../utils/ApiError.js';
import Skill from '../models/Skill.js';
import Experience from '../models/Experience.js';
import Education from '../models/Education.js';
import Certification from '../models/Certification.js';
import Service from '../models/Service.js';
import Testimonial from '../models/Testimonial.js';
import SocialLink from '../models/SocialLink.js';
import Announcement from '../models/Announcement.js';
import ProjectCategory from '../models/ProjectCategory.js';
import BlogCategory from '../models/BlogCategory.js';
import Project from '../models/Project.js';
import Blog from '../models/Blog.js';
import ContactMessage from '../models/ContactMessage.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

const staff = authorize(...STAFF);
const admins = authorize(...ADMINS);
const superOnly = authorize(ROLES.SUPER);
const activeOnly = () => ({ isActive: { $ne: false } });

const definitions = [
  { path: 'skills', Model: Skill, o: { searchFields: ['name', 'category', 'description'], filterFields: ['category', 'featured'], defaultSort: 'order,-level', publicFilter: activeOnly } },
  { path: 'experience', Model: Experience, o: { entity: 'Experience', searchFields: ['company', 'position'], defaultSort: 'order,-startDate', publicFilter: activeOnly } },
  { path: 'education', Model: Education, o: { entity: 'Education', searchFields: ['institution', 'degree'], defaultSort: 'order,-endYear', publicFilter: activeOnly } },
  { path: 'certifications', Model: Certification, o: { searchFields: ['title', 'organization'], defaultSort: 'order,-issueDate', publicFilter: activeOnly } },
  { path: 'services', Model: Service, o: { searchFields: ['title', 'description'], defaultSort: 'order', publicFilter: activeOnly } },
  {
    path: 'testimonials',
    Model: Testimonial,
    o: {
      searchFields: ['clientName', 'company', 'text'],
      filterFields: ['status'],
      defaultSort: 'order,-createdAt',
      publicFilter: () => ({ status: 'approved' }),
      statusGuard: { field: 'status', blocked: ['approved'], fallback: 'pending' },
    },
  },
  { path: 'social-links', Model: SocialLink, o: { entity: 'SocialLink', searchFields: ['platform'], defaultSort: 'order', publicFilter: activeOnly } },
  { path: 'announcements', Model: Announcement, publicRoutes: false, o: { searchFields: ['text'] } },
  { path: 'project-categories', Model: ProjectCategory, o: { entity: 'ProjectCategory', defaultSort: 'order,name' } },
  { path: 'blog-categories', Model: BlogCategory, o: { entity: 'BlogCategory', defaultSort: 'order,name' } },
  {
    path: 'projects',
    Model: Project,
    publicRoutes: false, // public endpoints live in project.controller.js
    o: {
      searchFields: ['title', 'shortDescription', 'technologies'],
      filterFields: ['publishStatus', 'category', 'featured', 'status'],
      protectedFields: ['views', 'likes', 'demoClicks', 'githubClicks', 'likedBy', 'githubMeta'],
      statusGuard: { field: 'publishStatus', blocked: ['published'], fallback: 'draft' },
    },
  },
  {
    path: 'blogs',
    Model: Blog,
    publicRoutes: false,
    o: {
      searchFields: ['title', 'excerpt', 'tags'],
      filterFields: ['status', 'category', 'featured'],
      protectedFields: ['views', 'readingTime'],
      statusGuard: { field: 'status', blocked: ['published', 'scheduled'], fallback: 'draft' },
    },
  },
  {
    path: 'messages',
    Model: ContactMessage,
    publicRoutes: false,
    readRoles: admins,
    writeRoles: admins,
    noCreate: true,
    o: { entity: 'Message', searchFields: ['name', 'email', 'subject'], filterFields: ['status'], updatableFields: ['status'], label: (d) => `${d.name}: ${d.subject}` },
  },
  {
    path: 'users',
    Model: User,
    publicRoutes: false,
    readRoles: superOnly,
    writeRoles: superOnly,
    deleteRoles: superOnly,
    o: {
      searchFields: ['name', 'email'],
      filterFields: ['role', 'isActive'],
      beforeSave: (req, body, existing) => {
        if (!body.password) delete body.password;
        if (existing && String(existing._id) === String(req.user._id)) {
          delete body.role;
          delete body.isActive;
        }
      },
      beforeDelete: async (req, doc) => {
        if (String(doc._id) === String(req.user._id)) throw new ApiError(400, 'You cannot delete your own account.');
        if (doc.role === ROLES.SUPER && (await User.countDocuments({ role: ROLES.SUPER })) <= 1) throw new ApiError(400, 'At least one Super Admin must remain.');
      },
      label: (d) => `${d.name} (${d.email})`,
    },
  },
  { path: 'activity-logs', Model: ActivityLog, publicRoutes: false, readRoles: admins, readOnly: true, o: { entity: 'ActivityLog', searchFields: ['userName', 'summary', 'entity'], filterFields: ['entity', 'action'] } },
];

export function mountResources(pub, admin) {
  for (const d of definitions) {
    const h = crud(d.Model, d.o);
    const read = d.readRoles || staff;
    const write = d.writeRoles || staff;
    const del = d.deleteRoles || admins;

    if (d.publicRoutes !== false) {
      pub.get(`/${d.path}`, h.publicList);
      pub.get(`/${d.path}/:id`, h.publicGet);
    }
    admin.get(`/${d.path}`, read, h.adminList);
    if (d.readOnly) continue;
    if (!d.noCreate) admin.post(`/${d.path}`, write, h.create);
    admin.get(`/${d.path}/:id`, read, h.adminGet);
    admin.put(`/${d.path}/:id`, write, h.update);
    admin.delete(`/${d.path}/:id`, del, h.remove);
  }
}
