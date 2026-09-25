import { useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Mail, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, errorMessage, get } from '../../lib/api';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import Button from '../../components/ui/Button';
import Pagination from '../../components/ui/Pagination';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { Skeleton } from '../../components/ui/Skeleton';
import StatusBadge from './StatusBadge';
import ConfirmDialog from './ConfirmDialog';
import { fmtDate } from '../../lib/utils';

const TABS = [{ id: '', label: 'All' }, { id: 'new', label: 'New' }, { id: 'read', label: 'Read' }, { id: 'replied', label: 'Replied' }, { id: 'archived', label: 'Archived' }];

export default function MessagesPage() {
  const qc = useQueryClient();
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const [open, setOpen] = useState(null);
  const [del, setDel] = useState(null);
  const params = { page, limit: 15, status: status || undefined };
  const list = useQuery({ queryKey: ['admin', 'messages', params], queryFn: () => get('/admin/messages', params), placeholderData: keepPreviousData });
  const refresh = () => qc.invalidateQueries({ queryKey: ['admin', 'messages'] });

  const setState = useMutation({
    mutationFn: ({ id, status: s }) => api.put(`/admin/messages/${id}`, { status: s }),
    onSuccess: (_r, v) => { setOpen((m) => (m ? { ...m, status: v.status } : m)); refresh(); qc.invalidateQueries({ queryKey: ['admin', 'summary'] }); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const remove = useMutation({
    mutationFn: (m) => api.delete(`/admin/messages/${m._id}`),
    onSuccess: () => { toast.success('Deleted'); setDel(null); setOpen(null); refresh(); },
    onError: (e) => toast.error(errorMessage(e)),
  });

  const view = (m) => {
    setOpen(m);
    if (m.status === 'new') setState.mutate({ id: m._id, status: 'read' });
  };
  const items = list.data?.items ?? [];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Messages</h1>
      <Tabs id="msg-tabs" className="mb-5 w-fit max-w-full" tabs={TABS} value={status} onChange={(v) => { setStatus(v); setPage(1); }} />
      {list.isLoading ? <div className="space-y-2">{Array.from({ length: 5 }, (_, i) => <Skeleton key={i} className="h-16" />)}</div> : list.isError ? <ErrorState error={list.error} onRetry={list.refetch} /> : items.length === 0 ? (
        <EmptyState icon={Mail} title="No messages here" text="Messages from your contact form will appear in this inbox." />
      ) : (
        <ul className="space-y-2">
          {items.map((m) => (
            <li key={m._id}>
              <button type="button" onClick={() => view(m)} className="card card-hover flex w-full items-center gap-4 p-4 text-left">
                <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${m.status === 'new' ? 'bg-accent' : 'bg-transparent'}`} aria-label={m.status === 'new' ? 'Unread' : undefined} />
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-baseline gap-x-3"><span className="font-semibold">{m.name}</span><span className="text-sm text-muted">{m.email}</span></span>
                  <span className="block truncate text-sm"><span className="font-medium">{m.subject}</span> <span className="text-muted">— {m.message}</span></span>
                </span>
                <span className="hidden shrink-0 text-right text-xs text-muted sm:block">{fmtDate(m.createdAt)}<br /><StatusBadge value={m.status} /></span>
              </button>
            </li>
          ))}
        </ul>
      )}
      {list.data && <Pagination page={list.data.pagination.page} pages={list.data.pagination.pages} onChange={setPage} />}

      <Modal open={Boolean(open)} onClose={() => setOpen(null)} title={open?.subject || ''} size="lg">
        {open && (
          <div>
            <dl className="mb-5 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-muted">From</dt><dd className="font-medium">{open.name}</dd></div>
              <div><dt className="text-muted">Email</dt><dd><a className="link-underline" href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject)}`}>{open.email}</a></dd></div>
              {open.projectType && <div><dt className="text-muted">About</dt><dd>{open.projectType}</dd></div>}
              {open.budget && <div><dt className="text-muted">Budget</dt><dd>{open.budget}</dd></div>}
              <div><dt className="text-muted">Received</dt><dd>{new Date(open.createdAt).toLocaleString('en-GB')}</dd></div>
              <div><dt className="text-muted">Status</dt><dd><StatusBadge value={open.status} /></dd></div>
            </dl>
            <p className="whitespace-pre-wrap rounded-xl border border-line bg-surface2/50 p-4 text-sm leading-relaxed">{open.message}</p>
            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Button size="sm" href={`mailto:${open.email}?subject=Re: ${encodeURIComponent(open.subject)}`} onClick={() => setState.mutate({ id: open._id, status: 'replied' })}>Reply by email</Button>
                {['read', 'replied', 'archived'].filter((s) => s !== open.status).map((s) => <Button key={s} size="sm" variant="secondary" onClick={() => setState.mutate({ id: open._id, status: s })}>Mark {s}</Button>)}
              </div>
              <Button size="sm" variant="danger" onClick={() => setDel(open)}><Trash2 className="h-4 w-4" /> Delete</Button>
            </div>
          </div>
        )}
      </Modal>
      <ConfirmDialog open={Boolean(del)} onClose={() => setDel(null)} loading={remove.isPending} text="Delete this message permanently?" onConfirm={() => remove.mutate(del)} />
    </div>
  );
}
