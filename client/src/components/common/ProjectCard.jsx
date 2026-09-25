import { Link } from 'react-router-dom';
import { Eye, ExternalLink, Github, Heart } from 'lucide-react';
import { api, img } from '../../lib/api';
import { compact, humanize } from '../../lib/utils';
import { useT } from '../../i18n';
import CoverArt from './CoverArt';

const statusStyle = { completed: 'badge-ok', 'in-progress': 'badge-warn', planned: 'badge-accent', archived: '' };

export default function ProjectCard({ project: p }) {
  const { t } = useT();
  const second = p.screenshots?.[0];
  const click = (kind) => api.post(`/projects/${p.slug}/click`, { kind }).catch(() => {});
  const tech = p.technologies || [];

  return (
    <article className="card card-hover group relative flex flex-col overflow-hidden">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface2">
        {p.cover ? (
          <img src={img(p.cover, 720)} alt={`${p.title} preview`} loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <CoverArt title={p.title} className="h-full w-full" />
        )}
        {second && p.cover && (
          <img src={img(second, 720)} alt="" aria-hidden="true" loading="lazy" className="absolute inset-0 h-full w-full object-cover opacity-0 transition duration-500 group-hover:opacity-100" />
        )}
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          {p.featured && <span className="badge badge-accent backdrop-blur">{t('featured')}</span>}
          {p.isPlaceholder && <span className="badge badge-warn backdrop-blur">Placeholder</span>}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center gap-2 text-xs text-muted">
          {p.category && <span>{humanize(p.category)}</span>}
          {p.status && <span className={`badge ${statusStyle[p.status] || ''}`}>{humanize(p.status)}</span>}
        </div>
        <h3 className="font-display text-xl font-bold leading-snug">
          <Link to={`/projects/${p.slug}`} className="after:absolute after:inset-0 after:content-['']">{p.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{p.shortDescription}</p>

        <ul className="mt-4 flex flex-wrap gap-1.5">
          {tech.slice(0, 4).map((x) => <li key={x} className="badge">{x}</li>)}
          {tech.length > 4 && <li className="badge">+{tech.length - 4}</li>}
        </ul>

        <div className="mt-auto flex items-center justify-between pt-5 text-xs text-muted">
          <span className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{compact(p.views)}</span>
            <span className="inline-flex items-center gap-1"><Heart className="h-3.5 w-3.5" />{compact(p.likes)}</span>
          </span>
          <span className="relative z-10 flex gap-1.5">
            {p.liveUrl && (
              <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" onClick={() => click('demo')} aria-label={`${t('liveDemo')}: ${p.title}`} className="grid h-8 w-8 place-items-center rounded-lg border border-line transition hover:border-accent/70 hover:text-accent">
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {p.githubUrl && (
              <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" onClick={() => click('github')} aria-label={`${t('sourceCode')}: ${p.title}`} className="grid h-8 w-8 place-items-center rounded-lg border border-line transition hover:border-accent/70 hover:text-accent">
                <Github className="h-4 w-4" />
              </a>
            )}
          </span>
        </div>
      </div>
    </article>
  );
}
