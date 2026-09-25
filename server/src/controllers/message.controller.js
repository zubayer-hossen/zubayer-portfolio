import ContactMessage from '../models/ContactMessage.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { visitorHash } from '../utils/visitor.js';
import { recordEvent } from '../services/analytics.service.js';
import { ok } from './crud.controller.js';

export const submit = asyncHandler(async (req, res) => {
  const { website, elapsed, ...data } = req.body;
  // Spam traps: honeypot filled, or form submitted faster than a human could.
  const looksLikeBot = Boolean(website) || (typeof elapsed === 'number' && elapsed < 2500);
  if (!looksLikeBot) {
    await ContactMessage.create({ ...data, ipHash: visitorHash(req) });
    recordEvent(req, { type: 'contact_submit', targetType: 'contact' });
  }
  ok(res, { received: true }, 201);
});
