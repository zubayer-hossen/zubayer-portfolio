import { useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { ArrowLeft, Eye, Github, Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, errorMessage, fieldErrors, get } from '../../lib/api';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { ErrorState } from '../../components/ui/States';
import { Skeleton } from '../../components/ui/Skeleton';
import { resources } from './config';
import { FormField, buildDefaults, cleanValues } from './FormFields';

export default function ResourceEditor({ resourceKey }) {
  const cfg = resources[resourceKey];
  const { id } = useParams();
  const isNew = id === 'new';
  const navigate = useNavigate();
  const qc = useQueryClient();

  const q = useQuery({ queryKey: ['admin', cfg.endpoint, 'one', id], queryFn: () => get(`/admin/${cfg.endpoint}/${id}`), enabled: !isNew, staleTime: 0, gcTime: 0 });
  const { control, handleSubmit, reset, setError, formState: { errors, isDirty, isSubmitting } } = useForm({ defaultValues: buildDefaults(cfg.fields) });

  useEffect(() => {
    if (isNew) reset(buildDefaults(cfg.fields));
    else if (q.data) reset(buildDefaults(cfg.fields, q.data));
  }, [q.data, isNew, cfg.fields, reset]);

  useEffect(() => {
    if (!isDirty) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);

  const done = () => {
    qc.invalidateQueries({ queryKey: ['admin', cfg.endpoint] });
    qc.invalidateQueries({ queryKey: ['site'] });
  };

  const onSubmit = async (values) => {
    try {
      const body = cleanValues(cfg.fields, values);
      const res = isNew ? await api.post(`/admin/${cfg.endpoint}`, body) : await api.put(`/admin/${cfg.endpoint}/${id}`, body);
      toast.success('Saved');
      done();
      if (isNew) navigate(`/admin/${resourceKey}/${res.data.data._id}`, { replace: true });
      else reset(buildDefaults(cfg.fields, res.data.data));
    } catch (e) {
      Object.entries(fieldErrors(e)).forEach(([name, message]) => setError(name, { message }));
      toast.error(errorMessage(e));
    }
  };

  const sync = async () => {
    try {
      const { data } = await api.post(`/admin/projects/${id}/sync-github`);
      toast.success('GitHub data synced');
      qc.setQueryData(['admin', cfg.endpoint, 'one', id], data.data);
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  if (!isNew && q.isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-1/2" /><Skeleton className="h-64" /></div>;
  if (!isNew && q.isError) return <ErrorState error={q.error} onRetry={q.refetch} />;

  const groups = [...new Set(cfg.fields.map((f) => f.group || 'Details'))];
  const errText = (name) => name.split('.').reduce((o, k) => o?.[k], errors)?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="sticky top-0 z-20 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg/85 px-6 py-3 backdrop-blur">
        <div className="flex items-center gap-3">
          <Link to={`/admin/${resourceKey}`} aria-label="Back to list" className="grid h-9 w-9 place-items-center rounded-lg text-muted hover:bg-surface2 hover:text-ink"><ArrowLeft className="h-5 w-5" /></Link>
          <h1 className="font-display text-xl font-bold">{isNew ? `New ${cfg.singular}` : `Edit ${cfg.singular}`}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          {!isNew && cfg.githubSync && <Button variant="secondary" size="sm" onClick={sync}><Github className="h-4 w-4" /> Sync GitHub</Button>}
          {!isNew && cfg.previewPath && q.data && <Button variant="secondary" size="sm" href={cfg.previewPath(q.data)} target="_blank"><Eye className="h-4 w-4" /> Preview</Button>}
          <Button type="submit" size="sm" loading={isSubmitting}><Save className="h-4 w-4" /> Save</Button>
        </div>
      </div>

      {q.data?.isPlaceholder && <Alert type="warning" title="Sample content" className="mb-6">This item was created as a placeholder. Replace the text with your real work, then untick “sample / placeholder”.</Alert>}

      <div className="space-y-6">
        {groups.map((g) => (
          <section key={g} className="card p-6">
            {groups.length > 1 && <h2 className="mb-5 font-display text-lg font-bold">{g}</h2>}
            <div className="grid gap-5 sm:grid-cols-2">
              {cfg.fields.filter((f) => (f.group || 'Details') === g).map((f) => <FormField key={f.name} field={f} control={control} error={errText(f.name)} />)}
            </div>
          </section>
        ))}
      </div>
    </form>
  );
}
