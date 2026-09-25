import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

export function parseRepo(url = '') {
  const m = /github\.com\/([^/\s]+)\/([^/#?\s]+)/i.exec(url);
  return m ? { owner: m[1], repo: m[2].replace(/\.git$/, '') } : null;
}

const headers = () => ({
  Accept: 'application/vnd.github+json',
  'User-Agent': 'zubayer-portfolio',
  ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}),
});

async function gh(url) {
  const res = await fetch(url, { headers: headers() });
  if (!res.ok) throw new ApiError(502, `GitHub API responded with ${res.status}. Is the repository public?`);
  return res;
}

/** Fetches stars, forks, languages and commit count for a public repository. */
export async function fetchRepoMeta(url) {
  const r = parseRepo(url);
  if (!r) throw new ApiError(400, 'That does not look like a GitHub repository URL.');
  const base = `https://api.github.com/repos/${r.owner}/${r.repo}`;
  const [repoRes, langRes, commitRes] = await Promise.all([gh(base), gh(`${base}/languages`), gh(`${base}/commits?per_page=1`)]);
  const repo = await repoRes.json();
  const langs = await langRes.json();
  const link = commitRes.headers.get('link') || '';
  const last = /[?&]page=(\d+)>;\s*rel="last"/.exec(link);
  const commits = last ? Number(last[1]) : (await commitRes.json()).length;
  return {
    stars: repo.stargazers_count,
    forks: repo.forks_count,
    languages: Object.keys(langs).slice(0, 6),
    commits,
    syncedAt: new Date(),
  };
}
