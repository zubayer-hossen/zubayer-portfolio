import { AlertTriangle, CheckCircle2, Info, XCircle } from 'lucide-react';
import { cn } from '../../lib/utils';

const styles = {
  info: ['border-accent/40 bg-accent/10 text-ink', Info],
  success: ['border-ok/40 bg-ok/10 text-ink', CheckCircle2],
  warning: ['border-warn/40 bg-warn/10 text-ink', AlertTriangle],
  error: ['border-danger/40 bg-danger/10 text-ink', XCircle],
};

export default function Alert({ type = 'info', title, children, className }) {
  const [cls, Icon] = styles[type];
  return (
    <div role={type === 'error' ? 'alert' : 'status'} className={cn('flex gap-3 rounded-xl border p-4 text-sm', cls, className)}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <div>
        {title && <p className="font-semibold">{title}</p>}
        <div className="text-ink/80">{children}</div>
      </div>
    </div>
  );
}
