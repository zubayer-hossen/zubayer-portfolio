import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';

function range(page, pages) {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1);
  const set = new Set([1, 2, pages - 1, pages, page - 1, page, page + 1]);
  const list = [...set].filter((n) => n >= 1 && n <= pages).sort((a, b) => a - b);
  const out = [];
  list.forEach((n, i) => {
    if (i && n - list[i - 1] > 1) out.push('…');
    out.push(n);
  });
  return out;
}

export default function Pagination({ page, pages, onChange }) {
  if (!pages || pages <= 1) return null;
  const btn = 'grid h-9 min-w-9 place-items-center rounded-lg border border-line px-2 text-sm transition';
  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-1.5">
      <button type="button" aria-label="Previous page" disabled={page <= 1} onClick={() => onChange(page - 1)} className={cn(btn, 'text-muted hover:border-accent/60 hover:text-ink disabled:opacity-40')}>
        <ChevronLeft className="h-4 w-4" />
      </button>
      {range(page, pages).map((n, i) =>
        n === '…' ? (
          <span key={`e${i}`} className="px-1 text-muted">…</span>
        ) : (
          <button key={n} type="button" aria-current={n === page ? 'page' : undefined} onClick={() => onChange(n)} className={cn(btn, n === page ? 'border-accent bg-accent text-accent-ink' : 'text-muted hover:border-accent/60 hover:text-ink')}>
            {n}
          </button>
        )
      )}
      <button type="button" aria-label="Next page" disabled={page >= pages} onClick={() => onChange(page + 1)} className={cn(btn, 'text-muted hover:border-accent/60 hover:text-ink disabled:opacity-40')}>
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  );
}
