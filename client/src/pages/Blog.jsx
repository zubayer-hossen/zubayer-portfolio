import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { keepPreviousData } from '@tanstack/react-query';
import { Search } from 'lucide-react';
import SEO from '../components/common/SEO';
import PageHeader from '../components/common/PageHeader';
import BlogCard from '../components/common/BlogCard';
import Tabs from '../components/ui/Tabs';
import Pagination from '../components/ui/Pagination';
import Button from '../components/ui/Button';
import { EmptyState, ErrorState } from '../components/ui/States';
import { GridSkeleton } from '../components/ui/Skeleton';
import { useApi, useDebounce, useItems } from '../hooks';
import { useT } from '../i18n';

export default function Blog() {
  const { t } = useT();
  const [sp, setSp] = useSearchParams();
  const params = Object.fromEntries(sp.entries());
  const [search, setSearch] = useState(params.q || '');
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

  const list = useApi('blogs', '/blogs', { q: params.q, category: params.category, tag: params.tag, sort: params.sort || 'latest', page: Number(params.page) || 1, limit: 9 }, { placeholderData: keepPreviousData });
  const facets = useApi('blog-facets', '/blogs/facets');
  const cats = useItems('blog-categories', '/blog-categories', { limit: 50 });
  const names = useMemo(() => Object.fromEntries(cats.items.map((c) => [c.slug, c.name])), [cats.items]);
  const items = list.data?.items ?? [];
  const pagination = list.data?.pagination;
  const hasFilters = params.q || params.category || params.tag;
  const clear = () => { setSearch(''); setSp({}, { replace: true }); };

  return (
    <>
      <SEO title="Blog" description="Articles on MERN stack development, learning notes and career." path="/blog" />
      <PageHeader title="Blog" text="Notes on things I built, broke and learned along the way." />
      <div className="container-x pb-10">
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <div className="relative min-w-56 flex-1">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search articles" aria-label="Search articles" className="input pl-10" />
          </div>
          <select aria-label="Sort articles" value={params.sort || 'latest'} onChange={(e) => setParam('sort', e.target.value)} className="input w-auto">
            <option value="latest">{t('latest')}</option>
            <option value="popular">{t('mostViewed')}</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
        {facets.data?.categories?.length > 0 && (
          <Tabs id="blog-cats" className="mb-4 w-fit max-w-full" value={params.category || 'all'} onChange={(v) => setParam('category', v === 'all' ? '' : v)} tabs={[{ id: 'all', label: 'All' }, ...facets.data.categories.map((c) => ({ id: c.slug, label: names[c.slug] || c.slug, count: c.count }))]} />
        )}
        {params.tag && <p className="mb-4 text-sm text-muted">Tagged <span className="badge badge-accent">#{params.tag}</span> <button type="button" onClick={() => setParam('tag', '')} className="ml-2 underline underline-offset-4">remove</button></p>}

        {list.isLoading ? <GridSkeleton count={6} /> : list.isError ? <ErrorState error={list.error} onRetry={list.refetch} /> : items.length === 0 ? (
          <EmptyState title={hasFilters ? t('noResults') : 'No articles yet'} text={hasFilters ? undefined : 'New posts will appear here.'} action={hasFilters ? <Button variant="secondary" onClick={clear}>{t('clearFilters')}</Button> : null} />
        ) : (
          <>
            <div className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-3 ${list.isPlaceholderData ? 'opacity-60 transition' : ''}`}>{items.map((b) => <BlogCard key={b._id} post={b} />)}</div>
            <Pagination page={pagination.page} pages={pagination.pages} onChange={(n) => { setParam('page', String(n)); window.scrollTo({ top: 0, behavior: 'smooth' }); }} />
          </>
        )}
      </div>
    </>
  );
}
