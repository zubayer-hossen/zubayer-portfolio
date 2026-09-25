const SKIP = new Set(['content', 'password', 'currentPassword', 'newPassword']);

const clean = (v) => {
  if (typeof v !== 'string') return v;
  if (/^\s*javascript:/i.test(v)) return '';
  return v.replace(/<\s*\/?\s*script[^>]*>/gi, '');
};

const walk = (val) => {
  if (Array.isArray(val)) return val.map(walk);
  if (val && typeof val === 'object') {
    const out = {};
    for (const [k, v] of Object.entries(val)) out[k] = SKIP.has(k) ? v : walk(v);
    return out;
  }
  return clean(val);
};

/** Strips <script> tags and javascript: URLs from JSON bodies. React escapes output; Markdown is sanitised on render. */
export const sanitizeBody = (req, _res, next) => {
  if (req.body && typeof req.body === 'object') req.body = walk(req.body);
  next();
};
