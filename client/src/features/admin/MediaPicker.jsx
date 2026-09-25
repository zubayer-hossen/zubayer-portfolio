import { useState } from 'react';
import { keepPreviousData } from '@tanstack/react-query';
import { FileText, Film } from 'lucide-react';
import Modal from '../../components/ui/Modal';
import Pagination from '../../components/ui/Pagination';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { Skeleton } from '../../components/ui/Skeleton';
import { useApi } from '../../hooks';
import { cn } from '../../lib/utils';

export function MediaThumb({ item, className }) {
  if (item.type === 'image') return <img src={item.url} alt={item.originalName || ''} loading="lazy" className={cn('h-full w-full object-cover', className)} />;
  const Icon = item.type === 'video' ? Film : FileText;
  return <div className="grid h-full w-full place-items-center bg-surface2 text-muted"><Icon className="h-8 w-8" /></div>;
}

/** Modal that lets admins pick an already-uploaded file. */
export default function MediaPicker({ open, onClose, onPick, accept = 'image' }) {
  const [page, setPage] = useState(1);
  const q = useApi('admin-media-picker', '/admin/media', { page, limit: 18, type: accept === 'any' ? undefined : accept }, { enabled: open, placeholderData: keepPreviousData, staleTime: 0 });
  const items = q.data?.items ?? [];
  return (
    <Modal open={open} onClose={onClose} title="Choose from media library" size="xl">
      {q.isLoading ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">{Array.from({ length: 12 }, (_, i) => <Skeleton key={i} className="aspect-square" />)}</div>
      ) : q.isError ? (
        <ErrorState error={q.error} onRetry={q.refetch} />
      ) : items.length === 0 ? (
        <EmptyState title="Nothing uploaded yet" text="Upload files from a form field or the Media library page." />
      ) : (
        <>
          <ul className="grid grid-cols-3 gap-3 sm:grid-cols-6">
            {items.map((m) => (
              <li key={m._id}>
                <button type="button" onClick={() => { onPick(m); onClose(); }} className="group block aspect-square w-full overflow-hidden rounded-xl border border-line transition hover:border-accent" title={m.originalName}>
                  <MediaThumb item={m} className="transition group-hover:scale-105" />
                </button>
              </li>
            ))}
          </ul>
          <Pagination page={q.data.pagination.page} pages={q.data.pagination.pages} onChange={setPage} />
        </>
      )}
    </Modal>
  );
}
