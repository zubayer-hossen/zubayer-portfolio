import { sha256 } from './token.js';
import { env } from '../config/env.js';

export const visitorHash = (req) =>
  sha256(`${req.ip}|${req.headers['user-agent'] || ''}|${env.IP_HASH_SALT}`).slice(0, 32);

export const isBot = (req) => /bot|crawl|spider|slurp|headless|preview|facebookexternalhit/i.test(req.headers['user-agent'] || '');

export const deviceOf = (ua = '') => (/ipad|tablet/i.test(ua) ? 'tablet' : /mobile|android|iphone/i.test(ua) ? 'mobile' : 'desktop');
