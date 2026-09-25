import { api } from './api';

export function trackPage(path) {
  if (path.startsWith('/admin') || path.startsWith('/preview')) return;
  api.post('/analytics/track', { path: path.slice(0, 300), referrer: (document.referrer || '').slice(0, 300) || undefined }).catch(() => {});
}

/** Run `fn` once per browser session for a given key (avoids double-counting views). */
export function once(key, fn) {
  try {
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, '1');
  } catch {
    /* storage blocked: still run */
  }
  fn();
}
