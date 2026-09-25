import { useEffect } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useApi } from '../hooks';
import { PageSkeleton } from '../components/ui/Skeleton';
import { ErrorState } from '../components/ui/States';
import SEO from '../components/common/SEO';
import ProjectView from '../features/projects/ProjectView';
import BlogView from '../features/blog/BlogView';
import { Forbidden, NotFound } from './ErrorPages';

/** Draft preview for admins: /preview/project/:id and /preview/blog/:id */
export default function Preview() {
  const { type, id } = useParams();
  const location = useLocation();
  const { status, check } = useAuth();
  const endpoint = type === 'project' ? 'projects' : type === 'blog' ? 'blogs' : null;

  useEffect(() => {
    if (status === 'idle') check();
  }, [status, check]);

  const q = useApi(`preview-${type}-${id}`, `/admin/${endpoint}/${id}`, undefined, { enabled: status === 'authed' && Boolean(endpoint), staleTime: 0, gcTime: 0, retry: false });

  if (!endpoint) return <NotFound />;
  if (status === 'idle' || status === 'loading') return <PageSkeleton />;
  if (status === 'guest') return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  if (q.isLoading) return <PageSkeleton />;
  if (q.error?.response?.status === 403) return <Forbidden />;
  if (q.error?.response?.status === 404) return <NotFound />;
  if (q.isError) return <div className="container-x py-24"><ErrorState error={q.error} onRetry={q.refetch} /></div>;

  return (
    <>
      <SEO title={`Preview: ${q.data.title}`} noindex />
      {type === 'project' ? <ProjectView project={{ ...q.data, related: [] }} preview /> : <BlogView post={{ ...q.data, related: [] }} preview />}
    </>
  );
}
