import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api/v1';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 20000,
  headers: { 'X-Requested-With': 'XMLHttpRequest' },
});

let refreshing = null;

// One silent refresh attempt when an access token has expired.
api.interceptors.response.use(
  (r) => r,
  async (error) => {
    const { config, response } = error;
    if (response?.status === 401 && config && !config._retry && !config.url?.includes('/auth/')) {
      config._retry = true;
      try {
        refreshing = refreshing || api.post('/auth/refresh').finally(() => (refreshing = null));
        await refreshing;
        return api(config);
      } catch {
        window.dispatchEvent(new Event('auth:expired'));
      }
    }
    return Promise.reject(error);
  }
);

export const unwrap = (promise) => promise.then((r) => r.data.data);
export const get = (url, params) => unwrap(api.get(url, { params }));

export const isNetworkError = (e) => Boolean(e?.request && !e?.response);

export const errorMessage = (e, fallback = 'Something went wrong. Please try again.') => {
  if (isNetworkError(e)) return 'Cannot reach the server. Check your connection and try again.';
  return e?.response?.data?.message || e?.message || fallback;
};

/** Field-level errors from the API (`details: [{path, message}]`) */
export const fieldErrors = (e) => Object.fromEntries((e?.response?.data?.details || []).map((d) => [d.path, d.message]));

/** Cloudinary delivery optimisation (auto format: WebP/AVIF, auto quality, width). */
export function img(url, width = 900) {
  if (!url) return url;
  if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('/upload/f_auto')) {
    return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width}/`);
  }
  return url;
}

export const SITE_URL = (import.meta.env.VITE_SITE_URL || window.location.origin).replace(/\/$/, '');
