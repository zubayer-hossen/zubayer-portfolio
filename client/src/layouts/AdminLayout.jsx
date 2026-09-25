import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Navigate, Outlet, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, LogOut, Menu, Moon, Sun, User as UserIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { NAV } from '../features/admin/config';
import Drawer from '../components/ui/Drawer';
import Dropdown from '../components/ui/Dropdown';
import { PageSkeleton } from '../components/ui/Skeleton';
import { cn, initials } from '../lib/utils';

function SidebarNav({ onNavigate }) {
  const { user } = useAuth();
  return (
    <nav aria-label="Admin" className="space-y-6 py-2">
      {NAV.map((g) => {
        const items = g.items.filter((i) => !i.roles || i.roles.includes(user.role));
        if (!items.length) return null;
        return (
          <div key={g.group}>
            <p className="mb-1.5 px-3 text-xs font-medium text-muted">{g.group}</p>
            <ul className="space-y-0.5">
              {items.map((i) => (
                <li key={i.to}>
                  <NavLink to={i.to} end={i.end} onClick={onNavigate} className={({ isActive }) => cn('block rounded-lg px-3 py-2 text-sm transition', isActive ? 'bg-accent/10 font-medium text-accent' : 'text-ink/80 hover:bg-surface2')}>{i.label}</NavLink>
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </nav>
  );
}

/** Auth gate + shell for every /admin page. */
export default function AdminLayout() {
  const { user, status, check, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (status === 'idle') check();
  }, [status, check]);

  if (status === 'idle' || status === 'loading') return <div className="min-h-screen bg-bg"><PageSkeleton /></div>;
  if (status === 'guest' || !user) return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;

  return (
    <div className="min-h-screen bg-bg lg:grid lg:grid-cols-[260px_1fr]">
      <Helmet><title>Admin</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <aside className="hidden h-screen overflow-y-auto border-r border-line bg-surface/50 px-3 py-5 lg:sticky lg:top-0 lg:block">
        <Link to="/admin" className="mb-4 flex items-center gap-2.5 px-3 font-display text-lg font-bold">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-extrabold text-accent-ink">A</span> Admin
        </Link>
        <SidebarNav />
      </aside>
      <Drawer open={open} onClose={() => setOpen(false)} title="Admin" side="left"><SidebarNav onNavigate={() => setOpen(false)} /></Drawer>

      <div className="min-w-0">
        <header className="flex h-14 items-center justify-between border-b border-line px-6">
          <button type="button" onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-lg text-muted hover:bg-surface2 lg:hidden"><Menu className="h-5 w-5" /></button>
          <span className="hidden lg:block" />
          <div className="flex items-center gap-1">
            <a href="/" target="_blank" rel="noopener noreferrer" className="btn btn-ghost btn-sm"><ExternalLink className="h-4 w-4" /> View site</a>
            <button type="button" onClick={toggle} aria-label="Switch theme" className="grid h-10 w-10 place-items-center rounded-lg text-muted hover:bg-surface2 hover:text-ink">{theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}</button>
            <Dropdown
              trigger={<span className="grid h-9 w-9 place-items-center rounded-full bg-accent text-sm font-bold text-accent-ink" aria-label="Account menu">{initials(user.name)}</span>}
              items={[
                { label: `${user.name} · ${user.role.replace('_', ' ')}`, icon: <UserIcon className="h-4 w-4" /> },
                { divider: true, key: 'd1' },
                { label: 'Sign out', icon: <LogOut className="h-4 w-4" />, danger: true, onClick: logout },
              ]}
            />
          </div>
        </header>
        <main className="px-6 py-8">
          <Suspense fallback={<PageSkeleton />}><Outlet /></Suspense>
        </main>
      </div>
    </div>
  );
}
