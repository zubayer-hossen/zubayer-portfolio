import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData } from '@tanstack/react-query';
import { Search, SlidersHorizontal } from 'lucide-react';
import SEO from '../components/common/SEO';
import PageHeader from '../components/common/PageHeader';
import ProjectCard from '../components/common/ProjectCard';
import Drawer from '../components/ui/Drawer';
import Pagination from '../components/ui/Pagination';
import Button from '../components/ui/Button';
import { EmptyState, ErrorState } from '../components/ui/States';
import { GridSkeleton } from '../components/ui/Skeleton';
import ProjectFilters from '../features/projects/ProjectFilters';
import { useApi, useDebounce, useItems } from '../hooks';
import { useT } from '../i18n';

const FILTER_KEYS = ['category', 'technology', 'status', 'type', 'featured'];

export default function Projects() {
  const { t } = useT();
  const [sp, setSp] = useSearchParams();
  const params = Object.fromEntries(sp.entries());
  const [search, setSearch] = useState(params.q || '');
  const [drawer, setDrawer] = useState(false);
  const debounced = useDebounce(search, 350);

  const setParam = (k, v) =>
    setSp((prev) => {
      const n = new URLSearchParams(prev);
      if (v) n.set(k, v);
      else n.delete(k);
      if (k !== 'page') n.delete('page');
      return n;
    }, { replace: true });

  useEffect(() => {
    if ((params.q || '') !== debounced) setParam('q', debounced);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  const query = { q: params.q, sort: params.sort || 'latest', page: Number(params.page) || 1, limit: 9, ...Object.fromEntries(FILTER_KEYS.map((k) => [k, params[k]])) };
  const list = useApi('projects', '/projects', query, { placeholderData: keepPreviousData });
  const facets = useApi('project-facets', '/projects/facets');
  const cats = useItems('project-categories', '/project-categories', { limit: 50 });
  const names = useMemo(() => Object.fromEntries(cats.items.map((c) => [c.slug, c.name])), [cats.items]);
  const hasFilters = FILTER_KEYS.some((k) => params[k]) || params.q;
  const clear = () => {
    setSearch('');
    setSp({}, { replace: true });
  };
  const items = list.data?.items ?? [];
  const pagination = list.data?.pagination;

  const filters = <ProjectFilters facets={facets.data || {}} categoryNames={names} params={params} setParam={setParam} clear={clear} hasFilters={hasFilters} />;

  return (
    <>
      <SEO title="Projects" description="Full-stack and MERN projects with case studies, source code and live demos." path="/projects" />
      <PageHeader title="Projects" text="Search, filter and open any project to see the story behind it." />
      <div className="container-x pb-10">
        <div className="mb-8 flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t('searchPlaceholder')} aria-label="Search projects" className="input pl-10" />
          </div>
          <select aria-label="Sort projects" value={query.sort} onChange={(e) => setParam('sort', e.target.value)} className="input w-auto">
            <option value="latest">{t('latest')}</option>
            <option value="popular">{t('popular')}</option>
            <option value="views">{t('mostViewed')}</option>
            <option value="featured">{t('featured')}</option>
            <option value="title">A–Z</option>
            <option value="oldest">Oldest</option>
          </select>
          <Button variant="secondary" className="lg:hidden" onClick={() => setDrawer(true)}><SlidersHorizontal className="h-4 w-4" /> {t('filters')}</Button>
        </div>

        <div className="grid gap-10 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block" aria-label={t('filters')}>{filters}</aside>
          <div>
            {list.isLoading ? (
              <GridSkeleton count={6} />
            ) : list.isError ? (
              <ErrorState error={list.error} onRetry={list.refetch} />
            ) : items.length === 0 ? (
              <EmptyState title={t('noResults')} action={hasFilters ? <Button variant="secondary" onClick={clear}>{t('clearFilters')}</Button> : null} />
            ) : (
              <>
                <p className="mb-4 text-sm text-muted" aria-live="polite">{pagination?.total} project{pagination?.total === 1 ? '' : 's'}</p>
                <div className={`grid gap-6 sm:grid-cols-2 xl:grid-cols-3 ${list.isPlaceholderData ? 'opacity-60 transition' : ''}`}>{items.map((p) => <ProjectCard key={p._id} project={p} />)}</div>
                <Pagination page={pagination.page} pages={pagination.pages} onChange={(n) => { setParam('page', String(n)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
              </>
            )}
          </div>
        </div>
      </div>
      <Drawer open={drawer} onClose={() => setDrawer(false)} title={t('filters')} side="left">{filters}</Drawer>
    </>
  );
}
