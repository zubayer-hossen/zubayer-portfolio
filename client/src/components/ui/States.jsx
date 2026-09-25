import { AlertTriangle, Inbox, WifiOff } from 'lucide-react';
import { errorMessage, isNetworkError } from '../../lib/api';
import { useT } from '../../i18n';
import Button from './Button';

export function EmptyState({ icon: Icon = Inbox, title, text, action }) {
  return (
    <div className="card mx-auto flex max-w-xl flex-col items-center px-6 py-14 text-center">
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-surface2 text-muted"><Icon className="h-6 w-6" /></span>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      {text && <p className="mt-1.5 max-w-sm text-sm text-muted">{text}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

export function ErrorState({ error, onRetry, title }) {
  const { t } = useT();
  const offline = isNetworkError(error);
  const Icon = offline ? WifiOff : AlertTriangle;
  return (
    <div role="alert" className="card mx-auto flex max-w-xl flex-col items-center px-6 py-14 text-center">
      <span className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-danger/10 text-danger"><Icon className="h-6 w-6" /></span>
      <h3 className="font-display text-lg font-bold">{title || (offline ? 'You appear to be offline' : t('loadError'))}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-muted">{errorMessage(error)}</p>
      {onRetry && <Button variant="secondary" className="mt-5" onClick={onRetry}>{t('retry')}</Button>}
    </div>
  );
}

/** Convenience: renders skeleton / error / empty / children depending on query state. */
export function QueryBoundary({ query, skeleton, empty, isEmpty, children }) {
  if (query.isLoading) return skeleton || null;
  if (query.isError) return <ErrorState error={query.error} onRetry={query.refetch} />;
  if (isEmpty) return empty || null;
  return children;
}
