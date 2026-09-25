import { useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import SEO from '../components/common/SEO';
import { useT } from '../i18n';

export function ErrorPage({ code, title, text, children }) {
  const { t } = useT();
  const navigate = useNavigate();
  return (
    <div className="container-x grid min-h-[70vh] place-items-center py-24 text-center">
      <SEO title={title} noindex />
      <div className="max-w-lg">
        <p className="font-display text-[7rem] font-extrabold leading-none text-accent/80 sm:text-[9rem]" aria-hidden="true">{code}</p>
        <h1 className="mt-2 font-display text-3xl font-bold">{title}</h1>
        <p className="mt-3 text-muted">{text}</p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button to="/">{t('backHome')}</Button>
          <Button variant="secondary" onClick={() => navigate(-1)}>Go back</Button>
          {children}
        </div>
      </div>
    </div>
  );
}

export const NotFound = () => <ErrorPage code="404" title="Page not found" text="The page you are looking for does not exist or may have been moved." />;
export const ServerError = () => <ErrorPage code="500" title="Server error" text="Something went wrong on our side. Please try again in a moment." />;
export const Unauthorized = () => <ErrorPage code="401" title="Please sign in" text="You need to sign in to view this page."><Button to="/admin/login" variant="secondary">Sign in</Button></ErrorPage>;
export const Forbidden = () => <ErrorPage code="403" title="Access denied" text="Your account does not have permission to open this page." />;

export function NetworkError({ onRetry }) {
  return (
    <div className="grid min-h-screen place-items-center bg-bg px-6 text-center">
      <div className="max-w-md">
        <p className="font-display text-6xl font-extrabold text-accent/80" aria-hidden="true">···</p>
        <h1 className="mt-4 font-display text-3xl font-bold">Cannot reach the server</h1>
        <p className="mt-3 text-muted">Check your internet connection. If you are running this locally, make sure the API server is started (<code className="font-mono text-sm">npm run dev</code>).</p>
        <Button className="mt-8" onClick={onRetry}>Try again</Button>
      </div>
    </div>
  );
}
