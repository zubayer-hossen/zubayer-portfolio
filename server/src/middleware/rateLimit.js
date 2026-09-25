import rateLimit from 'express-rate-limit';

const make = (windowMs, limit, message) =>
  rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { success: false, message },
  });

export const globalLimiter = make(15 * 60 * 1000, 600, 'Too many requests. Please slow down.');
export const authLimiter = make(15 * 60 * 1000, 15, 'Too many login attempts. Try again in a few minutes.');
export const contactLimiter = make(60 * 60 * 1000, 6, 'You have sent several messages already. Please try again later.');
export const trackLimiter = make(60 * 1000, 120, 'Too many requests.');
export const interactionLimiter = make(60 * 1000, 30, 'Too many requests.');
