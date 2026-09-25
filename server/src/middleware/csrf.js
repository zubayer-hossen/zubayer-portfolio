import { ApiError } from '../utils/ApiError.js';

/**
 * Cookie-authenticated, state-changing requests must carry a custom header.
 * Browsers only allow custom headers cross-origin after a CORS preflight,
 * which our strict CORS allow-list rejects for foreign origins.
 */
export const requireXhr = (req, _res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();
  if (req.headers['x-requested-with'] !== 'XMLHttpRequest') return next(new ApiError(403, 'Invalid request.'));
  next();
};
