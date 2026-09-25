import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { FilePlus2, FolderPlus, Image, Settings2 } from 'lucide-react';
import { get } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import AnalyticsView from '../../features/admin/AnalyticsView';
import StatusBadge from '../../features/admin/StatusBadge';
import { fmtDate } from '../../lib/utils';

const QUICK = [
  { to: '/admin/projects/new', label: 'New project', icon: FolderPlus },
  { to: '/admin/blogs/new', label: 'Write article', icon: FilePlus2 },
  { to: '/admin/media', label: 'Upload media', icon: Image },
  { to: '/admin/settings', label: 'Site settings', icon: Settings2 },
];

export default function Dashboard() {
  const { user, can } = useAuth();
  const isAdmin = can('super_admin', 'admin');
  const logs = useQuery({ queryKey: ['admin', 'activity-logs', 'recent'], queryFn: () => get('/admin/activity-logs', { limit: 6 }), enabled: isAdmin });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-display text-2xl font-bold">Welcome back, {user?.name?.split(' ')[0]}</h1>
        <p className="text-sm text-muted">Here is what is happening on your portfolio.</p>
      </div>
      <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {QUICK.map(({ to, label, icon: Icon }) => (
          <li key={to}><Link to={to} className="card card-hover flex items-center gap-3 p-4 text-sm font-medium"><span className="grid h-9 w-9 place-items-center rounded-lg bg-accent/10 text-accent"><Icon className="h-4 w-4" /></span>{label}</Link></li>
        ))}
      </ul>
      {isAdmin && <AnalyticsView compactMode />}
      {isAdmin && logs.data?.items?.length > 0 && (
        <section className="card p-5">
          <div className="mb-4 flex items-center justify-between"><h2 className="font-display font-bold">Recent activity</h2><Link to="/admin/activity-logs" className="text-sm text-accent">View all</Link></div>
          <ul className="divide-y divide-line text-sm">
            {logs.data.items.map((l) => (
              <li key={l._id} className="flex flex-wrap items-center gap-x-3 gap-y-1 py-2.5">
                <StatusBadge value={l.action} /><span className="font-medium">{l.userName}</span><span className="min-w-0 flex-1 truncate text-muted">{l.entity} · {l.summary}</span><span className="text-xs text-muted">{fmtDate(l.createdAt)}</span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
