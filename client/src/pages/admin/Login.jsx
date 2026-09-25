import { useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Helmet } from 'react-helmet-async';
import { LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { errorMessage } from '../../lib/api';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import { cn } from '../../lib/utils';

const schema = z.object({ email: z.string().trim().email('Enter a valid email address.'), password: z.string().min(1, 'Password is required.') });

export default function Login() {
  const { user, status, check, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm({ resolver: zodResolver(schema), defaultValues: { email: '', password: '' } });

  useEffect(() => {
    if (status === 'idle') check();
  }, [status, check]);

  if (status === 'authed' && user) return <Navigate to={location.state?.from || '/admin'} replace />;

  const onSubmit = async ({ email, password }) => {
    try {
      await login(email, password);
      navigate(location.state?.from || '/admin', { replace: true });
    } catch (e) {
      setError('root', { message: errorMessage(e, 'Login failed.') });
    }
  };

  return (
    <div className="grid min-h-screen place-items-center bg-bg px-5">
      <Helmet><title>Admin sign in</title><meta name="robots" content="noindex,nofollow" /></Helmet>
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <span className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-accent text-accent-ink"><LogIn className="h-6 w-6" /></span>
          <h1 className="font-display text-2xl font-bold">Admin sign in</h1>
          <p className="mt-1 text-sm text-muted">Manage your portfolio content.</p>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} noValidate className="card space-y-5 p-6">
          {errors.root && <Alert type="error">{errors.root.message}</Alert>}
          <div>
            <label htmlFor="l-email" className="label">Email</label>
            <input id="l-email" type="email" autoComplete="username" className={cn('input', errors.email && 'input-error')} {...register('email')} />
            {errors.email && <p className="field-error">{errors.email.message}</p>}
          </div>
          <div>
            <label htmlFor="l-pass" className="label">Password</label>
            <input id="l-pass" type="password" autoComplete="current-password" className={cn('input', errors.password && 'input-error')} {...register('password')} />
            {errors.password && <p className="field-error">{errors.password.message}</p>}
          </div>
          <Button type="submit" loading={isSubmitting} className="w-full">Sign in</Button>
        </form>
        <p className="mt-6 text-center text-sm"><a href="/" className="text-muted hover:text-ink">← Back to site</a></p>
      </div>
    </div>
  );
}
