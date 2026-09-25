import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const missing = ['MONGO_URI', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'].filter((k) => !process.env[k]);
if (missing.length) {
  console.error(`\n[config] Missing required environment variables: ${missing.join(', ')}`);
  console.error('[config] Copy server/.env.example to server/.env and fill the values.\n');
  process.exit(1);
}

const NODE_ENV = process.env.NODE_ENV || 'development';
const trim = (u) => (u || '').trim().replace(/\/$/, '');
const origins = (process.env.CLIENT_URL || 'http://localhost:5173').split(',').map(trim).filter(Boolean);
if (NODE_ENV !== 'production') origins.push('http://localhost:5173', 'http://127.0.0.1:5173');

export const env = {
  NODE_ENV,
  isProd: NODE_ENV === 'production',
  PORT: Number(process.env.PORT) || 5000,
  MONGO_URI: process.env.MONGO_URI,
  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
  JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES || '15m',
  JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES || '7d',
  CLIENT_URL: origins[0],
  CLIENT_ORIGINS: [...new Set(origins)],
  SERVER_URL: trim(process.env.SERVER_URL) || `http://localhost:${Number(process.env.PORT) || 5000}`,
  COOKIE_SAMESITE: process.env.COOKIE_SAMESITE || 'lax',
  IP_HASH_SALT: process.env.IP_HASH_SALT || 'portfolio-salt',
  GITHUB_TOKEN: process.env.GITHUB_TOKEN || '',
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET,
  },
  admin: {
    name: process.env.ADMIN_NAME || 'Admin',
    email: (process.env.ADMIN_EMAIL || '').toLowerCase(),
    password: process.env.ADMIN_PASSWORD || '',
  },
};
env.cloudinaryEnabled = Boolean(env.cloudinary.cloudName && env.cloudinary.apiKey && env.cloudinary.apiSecret);
