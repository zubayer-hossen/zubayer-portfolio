import AnalyticsEvent from '../models/AnalyticsEvent.js';
import { visitorHash, deviceOf, isBot } from '../utils/visitor.js';

export function recordEvent(req, data) {
  if (isBot(req)) return Promise.resolve();
  return AnalyticsEvent.create({
    ...data,
    visitorHash: visitorHash(req),
    device: deviceOf(req.headers['user-agent']),
  }).catch((e) => console.error('[analytics]', e.message));
}
