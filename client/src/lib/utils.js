import clsx from 'clsx';

export const cn = (...args) => clsx(args);

export function fmtDate(value, opts = { year: 'numeric', month: 'short', day: 'numeric' }) {
  if (!value) return '';
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? '' : d.toLocaleDateString('en-GB', opts);
}

export const fmtMonthYear = (v) => fmtDate(v, { year: 'numeric', month: 'short' });
export const compact = (n) => new Intl.NumberFormat('en', { notation: 'compact' }).format(n || 0);

export const initials = (name = '') =>
  name.split(/\s+/).filter(Boolean).slice(0, 2).map((w) => w[0]?.toUpperCase()).join('') || '·';

export function hashHue(str = '') {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 360;
  return h;
}

export const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

export function setPath(obj, path, value) {
  const keys = path.split('.');
  const out = Array.isArray(obj) ? [...obj] : { ...obj };
  let cur = out;
  keys.forEach((k, i) => {
    if (i === keys.length - 1) cur[k] = value;
    else {
      cur[k] = { ...(cur[k] || {}) };
      cur = cur[k];
    }
  });
  return out;
}

export const humanize = (s = '') => s.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export function slugifyHeading(text = '') {
  return String(text).toLowerCase().trim().replace(/[^\p{L}\p{N}\s-]/gu, '').replace(/\s+/g, '-');
}

export function nodeText(node) {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(nodeText).join('');
  return nodeText(node.props?.children);
}

/** Extract ## and ### headings (outside code fences) for a table of contents. */
export function extractHeadings(md = '') {
  const out = [];
  let fence = false;
  for (const line of md.split('\n')) {
    if (/^```/.test(line.trim())) fence = !fence;
    if (fence) continue;
    const m = /^(#{2,3})\s+(.+?)\s*#*$/.exec(line);
    if (m) out.push({ level: m[1].length, text: m[2].replace(/[*_`]/g, ''), id: slugifyHeading(m[2].replace(/[*_`]/g, '')) });
  }
  return out;
}

/** Turns YouTube / Vimeo links into embed URLs; returns { type, src } */
export function parseVideo(url = '') {
  if (!url) return null;
  const yt = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{6,})/.exec(url);
  if (yt) return { type: 'embed', src: `https://www.youtube-nocookie.com/embed/${yt[1]}` };
  const vm = /vimeo\.com\/(\d+)/.exec(url);
  if (vm) return { type: 'embed', src: `https://player.vimeo.com/video/${vm[1]}` };
  return { type: 'file', src: url };
}

export const isExternal = (url = '') => /^https?:\/\//i.test(url);
