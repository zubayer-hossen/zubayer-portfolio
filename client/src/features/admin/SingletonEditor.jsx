import { useEffect } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, errorMessage, get } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { ErrorState } from '../../components/ui/States';
import { Skeleton } from '../../components/ui/Skeleton';
import { singletons } from './config';
import { FormField, buildDefaults, cleanValues } from './FormFields';

export default function SingletonEditor({ sectionKey }) {
  const cfg = singletons[sectionKey];
  const { can } = useAuth();
  const qc = useQueryClient();
  const canSave = can('super_admin', 'admin');
  const q = useQuery({ queryKey: ['admin', 'content', sectionKey], queryFn: () => get(`/admin/content/${sectionKey}`), staleTime: 0 });
  const { control, handleSubmit, reset, formState: { isDirty, isSubmitting, errors } } = useForm({ defaultValues: buildDefaults(cfg.fields) });

  useEffect(() => {
    if (q.data) reset(buildDefaults(cfg.fields, q.data));
  }, [q.data, cfg.fields, reset]);

  useEffect(() => {
    if (!isDirty) return undefined;
    const warn = (e) => { e.preventDefault(); e.returnValue = ''; };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [isDirty]);

  const onSubmit = async (values) => {
    try {
      const { data } = await api.put(`/admin/content/${sectionKey}`, cleanValues(cfg.fields, values));
      toast.success('Saved');
      reset(buildDefaults(cfg.fields, data.data));
      qc.setQueryData(['admin', 'content', sectionKey], data.data);
      qc.invalidateQueries({ queryKey: ['site'] });
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };

  if (q.isLoading) return <div className="space-y-4"><Skeleton className="h-12 w-1/2" /><Skeleton className="h-64" /></div>;
  if (q.isError) return <ErrorState error={q.error} onRetry={q.refetch} />;

  const groups = [...new Set(cfg.fields.map((f) => f.group || 'Details'))];
  const errText = (name) => name.split('.').reduce((o, k) => o?.[k], errors)?.message;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <div className="sticky top-0 z-20 -mx-6 mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-line bg-bg/85 px-6 py-3 backdrop-blur">
        <div>
          <h1 className="font-display text-xl font-bold">{cfg.title}</h1>
          {cfg.text && <p className="text-sm text-muted">{cfg.text}</p>}
        </div>
        <Button type="submit" size="sm" loading={isSubmitting} disabled={!canSave}><Save className="h-4 w-4" /> Save changes</Button>
      </div>
      {!canSave && <Alert type="info" className="mb-6">Editors can view this section. Ask an admin to save changes.</Alert>}
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
