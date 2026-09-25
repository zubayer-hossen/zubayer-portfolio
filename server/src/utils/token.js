import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { env } from '../config/env.js';

export const sha256 = (s) => crypto.createHash('sha256').update(s).digest('hex');

export const signAccess = (u) =>
  jwt.sign({ sub: String(u._id), role: u.role }, env.JWT_ACCESS_SECRET, { expiresIn: env.JWT_ACCESS_EXPIRES });

export const signRefresh = (u) =>
  jwt.sign({ sub: String(u._id), jti: crypto.randomUUID() }, env.JWT_REFRESH_SECRET, { expiresIn: env.JWT_REFRESH_EXPIRES });

const base = {
  httpOnly: true,
  secure: env.isProd || env.COOKIE_SAMESITE === 'none',
  sameSite: env.COOKIE_SAMESITE,
};

export function setAuthCookies(res, access, refresh) {
  res.cookie('access_token', access, { ...base, maxAge: 15 * 60 * 1000, path: '/' });
  res.cookie('refresh_token', refresh, { ...base, maxAge: 7 * 24 * 3600 * 1000, path: '/api/v1/auth' });
}

export function clearAuthCookies(res) {
  res.clearCookie('access_token', { ...base, path: '/' });
  res.clearCookie('refresh_token', { ...base, path: '/api/v1/auth' });
}
