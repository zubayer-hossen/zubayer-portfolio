import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';

export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error('[ErrorBoundary]', error, info);
  }

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <div role="alert" className="grid min-h-screen place-items-center bg-bg px-6 text-center text-ink">
        <div className="max-w-md">
          <span className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-danger/10 text-danger"><AlertTriangle className="h-7 w-7" /></span>
          <h1 className="font-display text-3xl font-bold">Something broke on this page</h1>
          <p className="mt-3 text-muted">An unexpected error occurred. Reloading usually fixes it.</p>
          <button type="button" onClick={() => window.location.reload()} className="btn btn-primary mt-6">Reload page</button>
        </div>
      </div>
    );
  }
}
