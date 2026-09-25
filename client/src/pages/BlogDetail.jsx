import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api, img, SITE_URL } from '../lib/api';
import { once } from '../lib/track';
import { useApi } from '../hooks';
import SEO from '../components/common/SEO';
import { ErrorState } from '../components/ui/States';
import { PageSkeleton } from '../components/ui/Skeleton';
import BlogView from '../features/blog/BlogView';
import { NotFound } from './ErrorPages';

export default function BlogDetail() {
  const { slug } = useParams();
  const q = useApi(`blog-${slug}`, `/blogs/${slug}`, undefined, { retry: false });
  const b = q.data;

  useEffect(() => {
    if (b) once(`bv-${b.slug}`, () => api.post(`/blogs/${b.slug}/view`).catch(() => {}));
  }, [b]);

  if (q.isLoading) return <PageSkeleton />;
  if (q.error?.response?.status === 404) return <NotFound />;
  if (q.isError) return <div className="container-x py-24"><ErrorState error={q.error} onRetry={q.refetch} /></div>;

  return (
    <>
      <SEO
        title={b.seo?.title || b.title}
        description={b.seo?.description || b.excerpt}
        image={b.seo?.image || (b.cover ? img(b.cover, 1200) : undefined)}
        type="article"
        path={`/blog/${b.slug}`}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'BlogPosting', headline: b.title, description: b.excerpt, image: b.cover, datePublished: b.publishedAt, dateModified: b.updatedAt, author: { '@type': 'Person', name: b.author }, mainEntityOfPage: `${SITE_URL}/blog/${b.slug}` }}
      />
      <BlogView post={b} />
    </>
  );
}
