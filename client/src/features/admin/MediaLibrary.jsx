import { useRef, useState } from 'react';
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Copy, Trash2, UploadCloud } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, errorMessage, get } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Tabs from '../../components/ui/Tabs';
import Pagination from '../../components/ui/Pagination';
import Alert from '../../components/ui/Alert';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { Skeleton } from '../../components/ui/Skeleton';
import { cn } from '../../lib/utils';
import { uploadFiles } from './FormFields';
import { MediaThumb } from './MediaPicker';
import ConfirmDialog from './ConfirmDialog';

const FOLDERS = ['general', 'profile', 'projects', 'blog', 'certificates', 'resume', 'videos'];
const TYPES = [{ id: '', label: 'All' }, { id: 'image', label: 'Images' }, { id: 'video', label: 'Videos' }, { id: 'pdf', label: 'PDFs' }];

export default function MediaLibrary() {
  const qc = useQueryClient();
  const { can } = useAuth();
  const fileRef = useRef(null);
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [folder, setFolder] = useState('general');
  const [drag, setDrag] = useState(false);
  const [busy, setBusy] = useState(false);
  const [del, setDel] = useState(null);
  const params = { page, limit: 24, type: type || undefined };
  const list = useQuery({ queryKey: ['admin', 'media', params], queryFn: () => get('/admin/media', params), placeholderData: keepPreviousData });

  const upload = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      await uploadFiles(files, folder);
      toast.success(`${files.length} file${files.length > 1 ? 's' : ''} uploaded`);
      qc.invalidateQueries({ queryKey: ['admin', 'media'] });
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };
  const remove = useMutation({
    mutationFn: (m) => api.delete(`/admin/media/${m._id}`),
    onSuccess: () => { toast.success('Deleted'); setDel(null); qc.invalidateQueries({ queryKey: ['admin', 'media'] }); },
    onError: (e) => toast.error(errorMessage(e)),
  });
  const copy = async (url) => {
    try { await navigator.clipboard.writeText(url); toast.success('URL copied'); } catch { toast.error('Could not copy'); }
  };
  const items = list.data?.items ?? [];

  return (
    <div>
      <h1 className="mb-6 font-display text-2xl font-bold">Media library</h1>
      <Alert type="info" className="mb-6">Without Cloudinary keys, files are stored on the server disk (fine for local development). Add your Cloudinary credentials to <code className="font-mono">server/.env</code> before deploying.</Alert>

      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); upload(e.dataTransfer.files); }}
        className={cn('mb-8 flex flex-col items-center gap-3 rounded-2xl border border-dashed p-8 text-center transition', drag ? 'border-accent bg-accent/5' : 'border-line')}
      >
        <UploadCloud className="h-8 w-8 text-muted" />
        <p className="text-sm text-muted">{busy ? 'Uploading…' : 'Drag files here, or choose them'}</p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <select aria-label="Folder" value={folder} onChange={(e) => setFolder(e.target.value)} className="input w-auto">{FOLDERS.map((f) => <option key={f}>{f}</option>)}</select>
          <input ref={fileRef} type="file" multiple hidden accept="image/*,video/*,application/pdf" onChange={(e) => upload(e.target.files)} />
          <button type="button" className="btn btn-primary" disabled={busy} onClick={() => fileRef.current?.click()}>Choose files</button>
        </div>
        <p className="text-xs text-muted">PNG, JPG, WebP, GIF, AVIF, MP4, WebM, PDF · up to 50 MB each</p>
      </div>

      <Tabs id="media-tabs" className="mb-5 w-fit max-w-full" tabs={TYPES} value={type} onChange={(v) => { setType(v); setPage(1); }} />
      {list.isLoading ? <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">{Array.from({ length: 12 }, (_, i) => <Skeleton key={i} className="aspect-square" />)}</div> : list.isError ? <ErrorState error={list.error} onRetry={list.refetch} /> : items.length === 0 ? <EmptyState title="No files yet" text="Uploaded files will show up here." /> : (
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
          {items.map((m) => (
            <li key={m._id} className="group card overflow-hidden">
              <div className="aspect-square"><MediaThumb item={m} /></div>
              <div className="p-2.5">
                <p className="truncate text-xs" title={m.originalName}>{m.originalName}</p>
                <div className="mt-1.5 flex items-center justify-between">
                  <span className="text-[11px] text-muted">{m.size ? `${(m.size / 1024).toFixed(0)} KB` : m.type}</span>
                  <span className="flex gap-1">
                    <button type="button" aria-label="Copy URL" onClick={() => copy(m.url)} className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-surface2 hover:text-ink"><Copy className="h-3.5 w-3.5" /></button>
                    {can('super_admin', 'admin') && <button type="button" aria-label="Delete file" onClick={() => setDel(m)} className="grid h-7 w-7 place-items-center rounded-md text-muted hover:bg-danger/10 hover:text-danger"><Trash2 className="h-3.5 w-3.5" /></button>}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
      {list.data && <Pagination page={list.data.pagination.page} pages={list.data.pagination.pages} onChange={setPage} />}
      <ConfirmDialog open={Boolean(del)} onClose={() => setDel(null)} loading={remove.isPending} text={`Delete “${del?.originalName}”? Pages that use it will show a broken image.`} onConfirm={() => remove.mutate(del)} />
    </div>
  );
}
