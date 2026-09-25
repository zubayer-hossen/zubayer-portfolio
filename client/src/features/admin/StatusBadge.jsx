import { Check, Minus } from 'lucide-react';
import { cn, humanize } from '../../lib/utils';

const OK = ['published', 'approved', 'completed', 'active', 'replied', 'created', 'success'];
const WARN = ['draft', 'pending', 'new', 'in-progress', 'updated'];
const ACCENT = ['scheduled', 'planned', 'read', 'super_admin', 'admin', 'logged_in'];
const DANGER = ['deleted', 'archived'];

export default function StatusBadge({ value }) {
  if (!value) return <span className="text-muted">—</span>;
  const cls = OK.includes(value) ? 'badge-ok' : WARN.includes(value) ? 'badge-warn' : ACCENT.includes(value) ? 'badge-accent' : DANGER.includes(value) ? 'badge-danger' : '';
  return <span className={cn('badge', cls)}>{humanize(value)}</span>;
}

export const BoolCell = ({ value }) => (value ? <Check className="h-4 w-4 text-ok" aria-label="Yes" /> : <Minus className="h-4 w-4 text-muted" aria-label="No" />);
