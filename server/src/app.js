import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import compression from 'compression';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
import { env } from './config/env.js';
import routes from './routes/index.js';
import { globalLimiter } from './middleware/rateLimit.js';
import { sanitizeBody } from './middleware/sanitize.js';
import { notFound, errorHandler } from './middleware/error.js';
import { uploadsDir } from './services/media.service.js';
import { sitemap, robots, openGraph } from './controllers/seo.controller.js';
import { ApiError } from './utils/ApiError.js';

const app = express();
app.set('trust proxy', 1);
app.disable('x-powered-by');

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(
  cors({
    origin: (origin, cb) => (!origin || env.CLIENT_ORIGINS.includes(origin) ? cb(null, true) : cb(new ApiError(403, 'Origin not allowed.'))),
    credentials: true,
  })
);
app.use(compression());
app.use(morgan(env.isProd ? 'combined' : 'dev'));
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: false, limit: '1mb' }));
app.use(cookieParser());
app.use(mongoSanitize({ replaceWith: '_' }));
app.use(hpp());
app.use(sanitizeBody);

app.use('/uploads', express.static(uploadsDir, { maxAge: '7d' }));
app.get('/api/health', (_req, res) => res.json({ success: true, status: 'ok', time: new Date().toISOString() }));
app.use('/api', globalLimiter);
app.use('/api/v1', routes);

app.get('/sitemap.xml', sitemap);
app.get('/robots.txt', robots);
app.get('/og/:type/:slug', openGraph);

app.use(notFound);
app.use(errorHandler);

export default app;
