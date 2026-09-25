import { Router } from 'express';
import { protect, authorize } from '../middleware/auth.js';
import { requireXhr } from '../middleware/csrf.js';
import { validate } from '../middleware/validate.js';
import { upload } from '../middleware/upload.js';
import { authLimiter, contactLimiter, trackLimiter, interactionLimiter } from '../middleware/rateLimit.js';
import { ADMINS, ROLES, STAFF } from '../constants/roles.js';
import { loginSchema, changePasswordSchema, contactSchema, trackSchema } from '../validators/schemas.js';
import * as auth from '../controllers/auth.controller.js';
import * as site from '../controllers/site.controller.js';
import * as projects from '../controllers/project.controller.js';
import * as blogs from '../controllers/blog.controller.js';
import * as analytics from '../controllers/analytics.controller.js';
import * as media from '../controllers/media.controller.js';
import * as misc from '../controllers/misc.controller.js';
import { submit } from '../controllers/message.controller.js';
import { search } from '../controllers/search.controller.js';
import { mountResources } from './resources.js';

const router = Router();

// ---------- Auth ----------
const authRouter = Router();
authRouter.use(requireXhr);
authRouter.post('/login', authLimiter, validate(loginSchema), auth.login);
authRouter.post('/refresh', authLimiter, auth.refresh);
authRouter.post('/logout', auth.logout);
authRouter.get('/me', protect, auth.me);
authRouter.patch('/password', protect, authLimiter, validate(changePasswordSchema), auth.changePassword);
router.use('/auth', authRouter);

// ---------- Public ----------
const pub = Router();
pub.get('/site', site.getSite);
pub.get('/search', search);
pub.get('/assistant/context', misc.assistantContext);
pub.post('/analytics/track', trackLimiter, validate(trackSchema), analytics.track);
pub.post('/messages', contactLimiter, validate(contactSchema), submit);

pub.get('/projects', projects.list);
pub.get('/projects/facets', projects.facets);
pub.get('/projects/:slug', projects.getBySlug);
pub.post('/projects/:slug/view', interactionLimiter, projects.registerView);
pub.post('/projects/:slug/like', interactionLimiter, projects.toggleLike);
pub.post('/projects/:slug/click', interactionLimiter, projects.registerClick);

pub.get('/blogs', blogs.list);
pub.get('/blogs/facets', blogs.facets);
pub.get('/blogs/:slug', blogs.getBySlug);
pub.post('/blogs/:slug/view', interactionLimiter, blogs.registerView);

// ---------- Admin ----------
const admin = Router();
admin.use(protect, requireXhr);
admin.get('/content/:key', authorize(...STAFF), site.getContent);
admin.put('/content/:key', authorize(...ADMINS), site.putContent);
admin.get('/analytics/summary', authorize(...ADMINS), analytics.summary);
admin.get('/media', authorize(...STAFF), media.listMedia);
admin.post('/media', authorize(...STAFF), upload.array('files', 10), media.uploadMedia);
admin.delete('/media/:id', authorize(...ADMINS), media.deleteMedia);
admin.post('/projects/:id/sync-github', authorize(...STAFF), projects.syncGithub);
admin.get('/export', authorize(ROLES.SUPER), misc.exportAll);

mountResources(pub, admin);
router.use('/admin', admin);
router.use('/', pub);

export default router;
