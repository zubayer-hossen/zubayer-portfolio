import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, Eye, FolderKanban, Heart, Mail, MousePointerClick, Users } from 'lucide-react';
import { get } from '../../lib/api';
import { useTheme } from '../../context/ThemeContext';
import { compact } from '../../lib/utils';
import { ErrorState } from '../../components/ui/States';
import { Skeleton } from '../../components/ui/Skeleton';
import Alert from '../../components/ui/Alert';

const RANGES = [['today', 'Today'], ['7d', '7 days'], ['30d', '30 days'], ['90d', '90 days'], ['1y', '1 year'], ['all', 'All time']];

function Stat({ icon: Icon, label, value, to }) {
  const body = (
    <>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-accent/10 text-accent"><Icon className="h-5 w-5" /></span>
      <div><p className="font-display text-2xl font-bold tabular-nums">{compact(value)}</p><p className="text-xs text-muted">{label}</p></div>
    </>
  );
  const cls = 'card flex items-center gap-4 p-5';
  return to ? <Link to={to} className={`${cls} card-hover`}>{body}</Link> : <div className={cls}>{body}</div>;
}

function TopList({ title, rows, empty }) {
  const max = Math.max(1, ...rows.map((r) => r.count));
  return (
    <div className="card p-5">
      <h3 className="mb-4 font-display font-bold">{title}</h3>
      {rows.length === 0 ? <p className="text-sm text-muted">{empty}</p> : (
        <ul className="space-y-3">
          {rows.map((r) => (
            <li key={r._id || r.title}>
              <div className="mb-1 flex justify-between gap-3 text-sm"><span className="truncate">{r.title || 'Untitled'}</span><span className="tabular-nums text-muted">{r.count}</span></div>
              <div className="h-1.5 overflow-hidden rounded-full bg-surface2"><div className="h-full rounded-full bg-accent" style={{ width: `${(r.count / max) * 100}%` }} /></div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function AnalyticsView({ compactMode = false }) {
  const [range, setRange] = useState('30d');
  const { theme } = useTheme();
  const q = useQuery({ queryKey: ['admin', 'summary', range], queryFn: () => get('/admin/analytics/summary', { range }) });
  const accent = theme === 'dark' ? '#8C9CFF' : '#4B5BEA';
  const ok = theme === 'dark' ? '#34D399' : '#059669';
  const grid = theme === 'dark' ? '#222D48' : '#DDE1EE';
  const text = theme === 'dark' ? '#8B96B2' : '#5A6480';

  if (q.isLoading) return <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }, (_, i) => <Skeleton key={i} className="h-24" />)}</div>;
  if (q.isError) return <ErrorState error={q.error} onRetry={q.refetch} />;
  const { totals, series, topProjects, topBlogs, counts, sampleContent } = q.data;
  const samples = sampleContent.projects + sampleContent.blogs + sampleContent.skills;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-lg font-bold">{compactMode ? 'Overview' : 'Traffic and engagement'}</h2>
        <select aria-label="Date range" value={range} onChange={(e) => setRange(e.target.value)} className="input w-auto">{RANGES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}</select>
      </div>

      {samples > 0 && (
        <Alert type="warning" title="Sample content is still live">
          {sampleContent.projects} project{sampleContent.projects === 1 ? '' : 's'}, {sampleContent.blogs} article{sampleContent.blogs === 1 ? '' : 's'} and {sampleContent.skills} skill{sampleContent.skills === 1 ? '' : 's'} are placeholders. Replace them with real content before sharing the site.
        </Alert>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat icon={Users} label="Unique visitors" value={totals.visitors} />
        <Stat icon={Eye} label="Page views" value={totals.pageviews} />
        <Stat icon={FolderKanban} label="Project views" value={totals.projectViews} />
        <Stat icon={Mail} label={`Unread messages (${totals.messages} in range)`} value={counts.unreadMessages} to="/admin/messages" />
        <Stat icon={Eye} label="Blog views" value={totals.blogViews} />
        <Stat icon={MousePointerClick} label="Demo clicks" value={totals.demoClicks} />
        <Stat icon={MousePointerClick} label="GitHub clicks" value={totals.githubClicks} />
        <Stat icon={Heart} label="Project likes" value={totals.likes} />
      </div>

      <div className="card p-5">
        <h3 className="mb-4 font-display font-bold">Views over time</h3>
        {series.length === 0 ? <p className="py-10 text-center text-sm text-muted">No data in this range yet. Visit your public site to generate some.</p> : (
          <div className="h-72" role="img" aria-label="Line chart of page and content views per day">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series} margin={{ left: -18, right: 8, top: 4 }}>
                <defs><linearGradient id="g1" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={accent} stopOpacity={0.35} /><stop offset="100%" stopColor={accent} stopOpacity={0} /></linearGradient></defs>
                <CartesianGrid stroke={grid} strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="date" tick={{ fill: text, fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={(d) => d.slice(5)} />
                <YAxis tick={{ fill: text, fontSize: 11 }} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip contentStyle={{ background: theme === 'dark' ? '#0E1422' : '#fff', border: `1px solid ${grid}`, borderRadius: 12, fontSize: 12 }} />
                <Area type="monotone" dataKey="pageview" name="Page views" stroke={accent} fill="url(#g1)" strokeWidth={2} />
                <Area type="monotone" dataKey="project_view" name="Project views" stroke={ok} fill="none" strokeWidth={2} />
                <Area type="monotone" dataKey="blog_view" name="Blog views" stroke={text} fill="none" strokeWidth={2} strokeDasharray="4 3" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <TopList title="Top projects" rows={topProjects} empty="No project views yet." />
        <TopList title="Top articles" rows={topBlogs} empty="No article views yet." />
      </div>

      {!compactMode && (
        <div className="card p-5">
          <h3 className="mb-3 font-display font-bold">Content status</h3>
          <dl className="grid gap-4 text-sm sm:grid-cols-4">
            <div><dt className="text-muted">Projects</dt><dd className="font-display text-xl font-bold">{counts.projects}</dd></div>
            <div><dt className="text-muted">Draft projects</dt><dd className="font-display text-xl font-bold">{counts.draftProjects}</dd></div>
            <div><dt className="text-muted">Blog posts</dt><dd className="font-display text-xl font-bold">{counts.blogs}</dd></div>
            <div><dt className="text-muted">Draft posts</dt><dd className="font-display text-xl font-bold">{counts.draftBlogs}</dd></div>
          </dl>
          <p className="mt-4 flex items-start gap-2 text-xs text-muted"><AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />Analytics are self-hosted and privacy-friendly: visitors are counted with a salted hash, no cookies, no third-party trackers, and bots are ignored.</p>
        </div>
      )}
    </div>
  );
}
