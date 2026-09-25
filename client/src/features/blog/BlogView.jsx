import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Clock, Eye } from 'lucide-react';
import { img } from '../../lib/api';
import { cn, compact, extractHeadings, fmtDate, humanize } from '../../lib/utils';
import { useT } from '../../i18n';
import Alert from '../../components/ui/Alert';
import Markdown from '../../components/common/Markdown';
import ShareButtons from '../../components/common/ShareButtons';
import BlogCard from '../../components/common/BlogCard';
import CoverArt from '../../components/common/CoverArt';

function useActiveHeading(ids) {
  const [active, setActive] = useState('');
  useEffect(() => {
    if (!ids.length) return undefined;
    const obs = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-90px 0px -65% 0px' }
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, [ids]);
  return active;
}

export default function BlogView({ post: b, preview = false }) {
  const { t } = useT();
  const headings = useMemo(() => extractHeadings(b.content), [b.content]);
  const active = useActiveHeading(useMemo(() => headings.map((h) => h.id), [headings]));

  return (
    <article className="container-x pb-10 pt-10 sm:pt-14">
      {preview && <Alert type="warning" title="Preview" className="mb-8">This article is not visible to visitors until it is published.</Alert>}
      <Link to="/blog" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-ink"><ArrowLeft className="h-4 w-4" /> All articles</Link>

      <header className="max-w-3xl">
        <div className="mb-4 flex flex-wrap items-center gap-2 text-sm text-muted">
          {b.category && <span className="badge badge-accent">{humanize(b.category)}</span>}
          {b.isPlaceholder && <span className="badge badge-warn">Placeholder</span>}
          <span>{fmtDate(b.publishedAt || b.createdAt)}</span>
          <span className="inline-flex items-center gap-1"><Clock className="h-3.5 w-3.5" />{b.readingTime || 1} {t('minRead')}</span>
          {!preview && <span className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{compact(b.views)}</span>}
        </div>
        <h1 className="h-display">{b.title}</h1>
        {b.excerpt && <p className="lead mt-5">{b.excerpt}</p>}
        <p className="mt-5 text-sm text-muted">By {b.author}</p>
      </header>

      <div className="mt-10 overflow-hidden rounded-3xl border border-line">
        {b.cover ? <img src={img(b.cover, 1400)} alt="" className="aspect-[16/8] w-full object-cover" /> : <CoverArt title={b.title} className="aspect-[16/8] w-full" />}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0">
          <Markdown>{b.content}</Markdown>
          {b.tags?.length > 0 && <ul className="mt-10 flex flex-wrap gap-2">{b.tags.map((x) => <li key={x}><Link to={`/blog?tag=${encodeURIComponent(x)}`} className="badge transition hover:border-accent/60 hover:text-ink">#{x}</Link></li>)}</ul>}
          {!preview && (
            <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-6">
              <span className="text-sm text-muted">{t('share')}</span>
              <ShareButtons title={b.title} type="blog" slug={b.slug} path={`/blog/${b.slug}`} />
            </div>
          )}
          {(b.prev || b.next) && (
            <nav aria-label="More articles" className="mt-10 grid gap-4 sm:grid-cols-2">
              {b.prev ? <Link to={`/blog/${b.prev.slug}`} className="card card-hover p-5"><span className="flex items-center gap-1.5 text-xs text-muted"><ArrowLeft className="h-3.5 w-3.5" />{t('previous')}</span><span className="mt-1 block font-display font-bold">{b.prev.title}</span></Link> : <span />}
              {b.next && <Link to={`/blog/${b.next.slug}`} className="card card-hover p-5 sm:text-right"><span className="flex items-center gap-1.5 text-xs text-muted sm:justify-end">{t('next')}<ArrowRight className="h-3.5 w-3.5" /></span><span className="mt-1 block font-display font-bold">{b.next.title}</span></Link>}
            </nav>
          )}
        </div>

        {headings.length > 1 && (
          <aside className="hidden lg:block">
            <nav aria-label="Table of contents" className="sticky top-24">
              <p className="mb-3 font-display text-sm font-bold">On this page</p>
              <ul className="space-y-1 border-l border-line text-sm">
                {headings.map((h) => (
                  <li key={h.id}>
                    <a href={`#${h.id}`} className={cn('-ml-px block border-l py-1 transition', h.level === 3 ? 'pl-7' : 'pl-4', active === h.id ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-ink')}>{h.text}</a>
                  </li>
                ))}
              </ul>
            </nav>
          </aside>
        )}
      </div>

      {b.related?.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-bold">{t('related')}</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{b.related.map((r) => <BlogCard key={r._id} post={r} />)}</div>
        </section>
      )}
    </article>
  );
}
