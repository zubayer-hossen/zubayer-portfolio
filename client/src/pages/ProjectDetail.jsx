import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { api, img, SITE_URL } from '../lib/api';
import { once } from '../lib/track';
import { useApi } from '../hooks';
import SEO from '../components/common/SEO';
import { ErrorState } from '../components/ui/States';
import { PageSkeleton } from '../components/ui/Skeleton';
import ProjectView from '../features/projects/ProjectView';
import { NotFound } from './ErrorPages';

export default function ProjectDetail() {
  const { slug } = useParams();
  const q = useApi(`project-${slug}`, `/projects/${slug}`, undefined, { retry: false });
  const p = q.data;

  useEffect(() => {
    if (p) once(`pv-${p.slug}`, () => api.post(`/projects/${p.slug}/view`).catch(() => {}));
  }, [p]);

  if (q.isLoading) return <PageSkeleton />;
  if (q.error?.response?.status === 404) return <NotFound />;
  if (q.isError) return <div className="container-x py-24"><ErrorState error={q.error} onRetry={q.refetch} /></div>;

  return (
    <>
      <SEO
        title={p.seo?.title || p.title}
        description={p.seo?.description || p.shortDescription}
        image={p.seo?.image || (p.cover ? img(p.cover, 1200) : undefined)}
        path={`/projects/${p.slug}`}
        jsonLd={{ '@context': 'https://schema.org', '@type': 'CreativeWork', name: p.title, description: p.shortDescription, url: `${SITE_URL}/projects/${p.slug}`, image: p.cover, keywords: (p.technologies || []).join(', ') }}
      />
      <ProjectView project={p} />
    </>
  );
}
