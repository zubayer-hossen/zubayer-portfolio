import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Eye, Pencil, Plus, Search, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, errorMessage, get } from '../../lib/api';
import { useDebounce } from '../../hooks';
import { useAuth } from '../../context/AuthContext';
import { compact, fmtDate, humanize } from '../../lib/utils';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { Skeleton } from '../../components/ui/Skeleton';
import { resources } from './config';
import StatusBadge, { BoolCell } from './StatusBadge';
import ConfirmDialog from './ConfirmDialog';

function Cell({ col, row }) {
  const v = row[col.key];
  switch (col.type) {
    case 'status': return <StatusBadge value={v} />;
    case 'bool': return <BoolCell value={v} />;
    case 'number': return <span className="tabular-nums">{v == null ? '—' : compact(v)}</span>;
    case 'date': return <span className="whitespace-nowrap text-muted">{v ? fmtDate(v) : '—'}</span>;
    case 'datetime': return <span className="whitespace-nowrap text-muted">{v ? new Date(v).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : '—'}</span>;
    default: return <span className={col.primary ? 'font-medium' : 'text-muted'}>{String(v ?? '—').slice(0, 90)}</span>;
  }
}

export default function ResourceList({ resourceKey }) {
  const cfg = resources[resourceKey];
  const { can } = useAuth();
  const qc = useQueryClient();
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState('-createdAt');
  const [page, setPage] = useState(1);
  const [toDelete, setToDelete] = useState(null);
  const q = useDebounce(search, 350);
  const canDelete = can('super_admin', 'admin') && !cfg.readOnly;

  useEffect(() => setPage(1), [q, filters, sort]);

  const params = { page, limit: 15, q: q || undefined, sort, ...Object.fromEntries(Object.entries(filters).filter(([, v]) => v)) };
  const list = useQuery({ queryKey: ['admin', cfg.endpoint, params], queryFn: () => get(`/admin/${cfg.endpoint}`, params), placeholderData: keepPreviousData });
  const refresh = () => qc.invalidateQueries({ queryKey: ['admin', cfg.endpoint] });

  const del = useMutation({
    mutationFn: (row) => api.delete(`/admin/${cfg.endpoint}/${row._id}`),
    onSuccess: () => { toast.success('Deleted'); setToDelete(null); refresh(); qc.invalidateQueries({ queryKey: ['site'] }); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const patch = useMutation({
    mutationFn: ({ row, data }) => api.put(`/admin/${cfg.endpoint}/${row._id}`, data),
    onSuccess: () => { toast.success('Updated'); refresh(); qc.invalidateQueries({ queryKey: ['site'] }); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const items = list.data?.items ?? [];
  const pagination = list.data?.pagination;
  const sortOptions = [['-createdAt', 'Newest'], ['createdAt', 'Oldest'], ...(cfg.sortName ? [[cfg.sortName, 'A–Z']] : [])];

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold">{cfg.title}</h1>
          {pagination && <p className="text-sm text-muted">{pagination.total} total</p>}
        </div>
        {!cfg.readOnly && <Button to={`/admin/${resourceKey}/new`}><Plus className="h-4 w-4" /> New {cfg.singular}</Button>}
      </div>

      <div className="mb-4 flex flex-wrap gap-3">
        <div className="relative min-w-52 flex-1">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search…" aria-label={`Search ${cfg.title}`} className="input pl-10" />
        </div>
        {(cfg.filters || []).map((f) => (
          <select key={f.name} aria-label={f.label} value={filters[f.name] || ''} onChange={(e) => setFilters((s) => ({ ...s, [f.name]: e.target.value }))} className="input w-auto">
            <option value="">{f.label}: all</option>
            {f.options.map((o) => <option key={o} value={o}>{humanize(o)}</option>)}
          </select>
        ))}
        {sortOptions.length > 0 && !cfg.readOnly && (
          <select aria-label="Sort" value={sort} onChange={(e) => setSort(e.target.value)} className="input w-auto">
            {sortOptions.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
          </select>
        )}
      </div>

      {list.isLoading ? (
        <div className="space-y-2">{Array.from({ length: 6 }, (_, i) => <Skeleton key={i} className="h-14" />)}</div>
      ) : list.isError ? (
        <ErrorState error={list.error} onRetry={list.refetch} />
      ) : items.length === 0 ? (
        <EmptyState title={`No ${cfg.title.toLowerCase()} found`} text={q || Object.values(filters).some(Boolean) ? 'Try a different search or filter.' : undefined} action={!cfg.readOnly && <Button to={`/admin/${resourceKey}/new`}>Create the first one</Button>} />
      ) : (
        <div className={`card overflow-x-auto ${list.isPlaceholderData ? 'opacity-60' : ''}`}>
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-line text-xs text-muted">
                {cfg.columns.map((c) => <th key={c.key} scope="col" className="px-4 py-3 font-medium">{c.label}</th>)}
                <th scope="col" className="px-4 py-3 text-right font-medium">{cfg.readOnly ? '' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row._id} className="border-b border-line/60 last:border-0 hover:bg-surface2/40">
                  {cfg.columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 align-middle">
                      {c.primary && !cfg.readOnly ? <Link to={`/admin/${resourceKey}/${row._id}`} className="hover:text-accent"><Cell col={c} row={row} /></Link> : <Cell col={c} row={row} />}
                      {c.primary && row.isPlaceholder && <span className="badge badge-warn ml-2">Sample</span>}
                    </td>
                  ))}
                  <td className="px-4 py-3">
                    {!cfg.readOnly && (
                      <div className="flex items-center justify-end gap-1">
                        {(cfg.quickActions || []).filter((a) => a.when(row) && (!a.adminOnly || can('super_admin', 'admin'))).map((a) => (
                          <Button key={a.label} size="sm" variant="secondary" onClick={() => patch.mutate({ row, data: a.patch })}>{a.label}</Button>
                        ))}
                        {cfg.previewPath && <Link to={cfg.previewPath(row)} target="_blank" aria-label="Preview" className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface2 hover:text-ink"><Eye className="h-4 w-4" /></Link>}
                        <Link to={`/admin/${resourceKey}/${row._id}`} aria-label="Edit" className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface2 hover:text-ink"><Pencil className="h-4 w-4" /></Link>
                        {canDelete && <button type="button" aria-label="Delete" onClick={() => setToDelete(row)} className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-danger/10 hover:text-danger"><Trash2 className="h-4 w-4" /></button>}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {pagination && <Pagination page={pagination.page} pages={pagination.pages} onChange={setPage} />}
      <ConfirmDialog open={Boolean(toDelete)} onClose={() => setToDelete(null)} loading={del.isPending} text={`Delete “${toDelete?.title || toDelete?.name || toDelete?.clientName || toDelete?.position || toDelete?.degree || toDelete?.platform || toDelete?.email || 'this item'}”? This cannot be undone.`} onConfirm={() => del.mutate(toDelete)} />
    </div>
  );
}
