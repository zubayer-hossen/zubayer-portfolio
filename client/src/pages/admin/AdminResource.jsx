import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { resources, singletons } from '../../features/admin/config';
import ResourceList from '../../features/admin/ResourceList';
import ResourceEditor from '../../features/admin/ResourceEditor';
import SingletonEditor from '../../features/admin/SingletonEditor';
import MessagesPage from '../../features/admin/MessagesPage';
import MediaLibrary from '../../features/admin/MediaLibrary';
import Security from './Security';
import { Forbidden, NotFound } from '../ErrorPages';

/** Routes /admin/:resource and /admin/:resource/:id to the right generic screen. */
export default function AdminResource() {
  const { resource, id } = useParams();
  const { user } = useAuth();

  if (singletons[resource] && !id) return <SingletonEditor key={resource} sectionKey={resource} />;
  if (resource === 'media' && !id) return <MediaLibrary />;
  if (resource === 'security' && !id) return <Security />;
  if (resource === 'messages' && !id) return ['super_admin', 'admin'].includes(user.role) ? <MessagesPage /> : <Forbidden />;

  const cfg = resources[resource];
  if (!cfg || (id && cfg.readOnly)) return <NotFound />;
  if (!cfg.roles.includes(user.role)) return <Forbidden />;
  return id ? <ResourceEditor key={`${resource}-${id}`} resourceKey={resource} /> : <ResourceList key={resource} resourceKey={resource} />;
}
