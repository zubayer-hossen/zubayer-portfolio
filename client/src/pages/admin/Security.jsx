import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Download } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, errorMessage, fieldErrors } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { cn } from '../../lib/utils';

// Mirrors server/src/validators/schemas.js (changePasswordSchema)
const schema = z.object({
  currentPassword: z.string().min(1, 'Enter your current password.'),
  newPassword: z.string().min(10, 'Use at least 10 characters.').regex(/[a-z]/, 'Add a lowercase letter.').regex(/[A-Z]/, 'Add an uppercase letter.').regex(/\d/, 'Add a number.'),
  confirm: z.string(),
}).refine((d) => d.newPassword === d.confirm, { path: ['confirm'], message: 'Passwords do not match.' });

export default function Security() {
  const { user, can } = useAuth();
  const [exporting, setExporting] = useState(false);
  const { register, handleSubmit, reset, setError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: { currentPassword: '', newPassword: '', confirm: '' } });

  const onSubmit = async ({ currentPassword, newPassword }) => {
    try {
      await api.patch('/auth/password', { currentPassword, newPassword });
      toast.success('Password changed. Other devices were signed out.');
      reset();
    } catch (e) {
      Object.entries(fieldErrors(e)).forEach(([n, message]) => setError(n, { message }));
      toast.error(errorMessage(e));
    }
  };

  const exportData = async () => {
    setExporting(true);
    try {
      const { data } = await api.get('/admin/export', { responseType: 'blob' });
      const url = URL.createObjectURL(data);
      const a = Object.assign(document.createElement('a'), { href: url, download: `portfolio-backup-${new Date().toISOString().slice(0, 10)}.json` });
      a.click();
      URL.revokeObjectURL(url);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setExporting(false);
    }
  };

  const field = (name, label, auto) => (
    <div>
      <label htmlFor={`s-${name}`} className="label">{label}</label>
      <input id={`s-${name}`} type="password" autoComplete={auto} className={cn('input', errors[name] && 'input-error')} {...register(name)} />
      {errors[name] && <p className="field-error">{errors[name].message}</p>}
    </div>
  );

  return (
    <div className="max-w-xl space-y-8">
      <h1 className="font-display text-2xl font-bold">Security and backup</h1>
      <section className="card p-6">
        <h2 className="font-display text-lg font-bold">Change password</h2>
        <p className="mb-5 mt-1 text-sm text-muted">Signed in as {user?.email}. Changing your password signs you out everywhere else.</p>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-4">
          {field('currentPassword', 'Current password', 'current-password')}
          {field('newPassword', 'New password', 'new-password')}
          {field('confirm', 'Confirm new password', 'new-password')}
          <Button type="submit" loading={isSubmitting}>Update password</Button>
        </form>
      </section>
      {can('super_admin') ? (
        <section className="card p-6">
          <h2 className="font-display text-lg font-bold">Backup</h2>
          <p className="mb-5 mt-1 text-sm text-muted">Download all content (not users or analytics) as a JSON file. Keep it somewhere safe.</p>
          <Button variant="secondary" loading={exporting} onClick={exportData}><Download className="h-4 w-4" /> Download JSON backup</Button>
        </section>
      ) : (
        <Alert type="info">Backups can only be downloaded by a Super Admin.</Alert>
      )}
    </div>
  );
}
