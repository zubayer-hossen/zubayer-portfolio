# Zubayer Hossen — Portfolio Platform (MERN)

A premium, fully admin-managed portfolio: public site, project marketplace, Markdown blog, case studies,
self-hosted analytics and a role-based admin dashboard. Every piece of content (hero text, skills, projects,
articles, navigation, homepage section order…) lives in MongoDB and is edited from `/admin` — no code changes
needed to update the site.

## Features

**Public site**
- Dark-first design with light theme, smooth theme switch, CSS-only 3D cube loader, hero with mouse-parallax 3D card
- Homepage sections are configurable (order and visibility) from the admin panel
- Project marketplace: search, category / technology / status / type filters, sorting, pagination, URL-synced state
- Project detail: video or image hero, gallery with zoom lightbox, GitHub stats, case study timeline, like button, related projects
- Blog: Markdown, table of contents with active heading, reading time, categories, tags, share buttons, previous / next, scheduled publishing
- `Ctrl / ⌘ + K` command palette (global search), custom cursor ring (desktop, optional), Konami-code easter egg
- Online resume with print stylesheet and PDF download, contact form with honeypot + time-trap spam protection
- SEO: per-page titles/meta, Open Graph landing route for social shares (`/og/...`), JSON-LD, sitemap.xml, robots.txt
- Accessibility: skip link, focus rings, ARIA labels, reduced-motion support, keyboard-friendly dialogs
- i18n scaffold (English complete; Bengali and German partial) ready to extend

**Admin dashboard**
- JWT auth in HTTP-only cookies (15 min access + 7 day rotating refresh), roles: Super Admin / Admin / Editor
- CRUD for skills, experience, education, certifications, projects (+ case study, GitHub sync), blog posts, categories,
  services, testimonials (approval), social links, announcements, users, messages inbox
- Singleton editors: profile, hero, about, resume, SEO, site settings
- Media library (Cloudinary, with local-disk fallback for development)
- Analytics (self-hosted, privacy-friendly), activity log, JSON backup, draft preview before publishing
- Sample content is clearly flagged so it cannot be mistaken for real work

## Tech stack

| Layer | Tools |
|---|---|
| Client | React 18, Vite, React Router 6, TanStack Query, Tailwind CSS 3, Framer Motion, React Hook Form + Zod, Recharts, react-markdown |
| Server | Node.js (ESM), Express 4, Mongoose 8, Zod, JWT, bcryptjs, Multer, Cloudinary |
| Security | Helmet, strict CORS allow-list, rate limiting, mongo-sanitize, hpp, input sanitising, CSRF header check, hashed refresh tokens |

## Project structure

```
zubayer-portfolio/
├─ client/                 React app (Vite)
│  └─ src/
│     ├─ components/       ui/ (primitives), common/, effects/, three/ (CSS 3D loader)
│     ├─ context/          Theme, Site (public content), Auth
│     ├─ features/         home/, projects/, blog/, skills/, contact/, search/, admin/
│     ├─ layouts/          PublicLayout, AdminLayout, Navbar, Footer, Announcement
│     ├─ pages/            public pages + pages/admin/
│     ├─ router/  hooks/  lib/  i18n/  styles/
├─ server/                 Express API
│  └─ src/
│     ├─ config/  constants/  middleware/  models/  validators/
│     ├─ controllers/      crud.controller.js is a generic factory used by most collections
│     ├─ routes/           index.js (public/auth/admin), resources.js (declarative resource list)
│     ├─ services/         media, github, analytics, activity log, knowledge base (AI-assistant hook)
│     └─ seeders/          default content + seed script
├─ netlify.toml  render.yaml  client/vercel.json   deployment configs
└─ SETUP-BN.md             step-by-step setup guide in Bengali
```

## Quick start

Requirements: **Node.js 18+** and a **MongoDB** database (local or a free MongoDB Atlas cluster).

```bash
# 1. install everything
npm run setup

# 2. configure the API (a working development .env is already included)
#    edit server/.env and set MONGO_URI to your database

# 3. create the admin user + starter content
npm run seed

# 4. start API (http://localhost:5000) and site (http://localhost:5173)
npm run dev
```

Admin panel: <http://localhost:5173/admin> — sign in with `ADMIN_EMAIL` / `ADMIN_PASSWORD` from `server/.env`
(default `admin@example.com` / `Admin@12345678`). **Change the email in `.env` before seeding, and the password in
Admin → Security immediately after your first login.**

## Environment variables

`server/.env` (see `server/.env.example`)

| Variable | Purpose |
|---|---|
| `MONGO_URI` | MongoDB connection string |
| `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `IP_HASH_SALT` | Long random strings. Generate new ones for production |
| `CLIENT_URL` | Public site URL (comma-separated list allowed). Used for CORS, sitemap, OG pages |
| `SERVER_URL` | Public API URL (used to build URLs of locally stored uploads) |
| `COOKIE_SAMESITE` | `lax` when the site proxies `/api` (default). `none` when the site calls the API on another domain |
| `CLOUDINARY_*` | Optional in development; required in production for durable uploads |
| `ADMIN_NAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Used only by `npm run seed` |
| `GITHUB_TOKEN` | Optional, raises the GitHub API rate limit for repo sync |

`client/.env` (see `client/.env.example`): `VITE_API_URL` (default `/api/v1`), `VITE_SITE_URL`.

## Adding your real content (recommended order)

1. **Admin → Profile / Hero / About**: your details, photo, availability text
2. **Admin → Skills**: adjust proficiency levels honestly; remove skills you cannot discuss in an interview
3. **Admin → Projects**: replace the three sample projects (marked *Placeholder*) with real ones; add screenshots, links, case study
4. **Admin → Resume**: upload your PDF
5. **Admin → Social links**: fill and activate GitHub / LinkedIn
6. **Admin → Settings**: reorder homepage sections, edit navigation and stats
7. The dashboard warns you while sample content is still published

## Deployment

1. **Database** — create a free MongoDB Atlas cluster, allow network access, copy the connection string into `MONGO_URI`.
2. **Media** — create a free Cloudinary account and set the three `CLOUDINARY_*` variables.
3. **API (Render / Railway)** — root directory `server`, build `npm install`, start `npm start`.
   `render.yaml` is included. Set `NODE_ENV=production`, `CLIENT_URL` (your site URL), `SERVER_URL` (your API URL),
   strong secrets and a **non-default** `ADMIN_PASSWORD`. Run `npm run seed` once from the service shell.
4. **Site (Netlify / Vercel)** — deploy the repository (Netlify reads `netlify.toml`; on Vercel set the root directory to `client`).
   **Replace `YOUR-BACKEND.onrender.com` in `netlify.toml` / `client/vercel.json` with your API host.** These rewrites proxy
   `/api`, `/uploads`, `/og`, `/sitemap.xml` and `/robots.txt` through your domain, which keeps cookies first-party and makes
   social-share previews work. Set `VITE_SITE_URL` to your final site URL.
5. If you skip the proxy and call the API directly from another domain: set `VITE_API_URL` to the full API URL, `COOKIE_SAMESITE=none`
   and add the site to `CLIENT_URL`. Some browsers block third-party cookies, so the proxy setup is more reliable.

## API overview (`/api/v1`)

| Area | Endpoints |
|---|---|
| Auth | `POST /auth/login · /auth/refresh · /auth/logout`, `GET /auth/me`, `PATCH /auth/password` |
| Public | `GET /site`, `/projects`, `/projects/facets`, `/projects/:slug`, `/blogs`, `/blogs/:slug`, `/skills`, `/experience`, `/education`, `/certifications`, `/services`, `/testimonials`, `/social-links`, `/search?q=`, `/assistant/context`; `POST /messages`, `/analytics/track`, `/projects/:slug/like|view|click`, `/blogs/:slug/view` |
| Admin | `/admin/{skills,experience,education,certifications,services,testimonials,social-links,announcements,project-categories,blog-categories,projects,blogs,messages,users,activity-logs}` (CRUD), `/admin/content/:key`, `/admin/media`, `/admin/analytics/summary`, `/admin/projects/:id/sync-github`, `/admin/export` |
| Other | `GET /sitemap.xml`, `/robots.txt`, `/og/:type/:slug`, `/api/health` |

## Security notes

- Passwords hashed with bcrypt (cost 12); login timing does not reveal whether an email exists
- Refresh tokens are stored hashed, rotated on every use; reuse of an old token revokes all sessions
- Cookies are `HttpOnly`, `Secure` in production, with configurable `SameSite`
- State-changing admin/auth requests require an `X-Requested-With` header and pass the strict CORS allow-list
- Rate limits on the API, login, contact form and tracking endpoints; request bodies sanitised; Markdown sanitised on render
- Editors can draft but cannot publish, delete, approve testimonials or change site-wide content

## Known limitations and future work

- Not yet covered by automated tests
- The contact form stores messages in the admin inbox; email notifications are not implemented
- Content import (restore from backup JSON) is not implemented; export is
- Search uses simple regex matching, which is fine for a portfolio-sized dataset
- The hero uses CSS 3D + parallax (no WebGL) to keep the bundle small
- AI assistant: `GET /api/v1/assistant/context` and `services/knowledge.service.js` provide the knowledge base for a future chatbot
- Multi-language content (Bengali / German) needs translated content fields; the UI strings scaffold is in `client/src/i18n`
