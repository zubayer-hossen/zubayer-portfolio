import { Link } from 'react-router-dom';
import { Clock } from 'lucide-react';
import { img } from '../../lib/api';
import { fmtDate, humanize } from '../../lib/utils';
import { useT } from '../../i18n';
import CoverArt from './CoverArt';

export default function BlogCard({ post: b }) {
  const { t } = useT();
  return (
    <article className="card card-hover group relative flex flex-col overflow-hidden">
      <div className="aspect-[16/9] overflow-hidden bg-surface2">
        {b.cover ? (
          <img src={img(b.cover, 700)} alt="" loading="lazy" decoding="async" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
        ) : (
          <CoverArt title={b.title} className="h-full w-full" />
        )}
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted">
          {b.category && <span className="badge badge-accent">{humanize(b.category)}</span>}
          {b.isPlaceholder && <span className="badge badge-warn">Placeholder</span>}
          <span>{fmtDate(b.publishedAt)}</span>
        </div>
        <h3 className="font-display text-xl font-bold leading-snug">
          <Link to={`/blog/${b.slug}`} className="after:absolute after:inset-0 after:content-['']">{b.title}</Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted">{b.excerpt}</p>
        <p className="mt-auto inline-flex items-center gap-1.5 pt-5 text-xs text-muted">
          <Clock className="h-3.5 w-3.5" /> {b.readingTime || 1} {t('minRead')}
        </p>
      </div>
    </article>
  );
}
