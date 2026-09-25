import { useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/utils';

export default function Dropdown({ trigger, items, align = 'right' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    if (!open) return undefined;
    const close = (e) => (e.type === 'keydown' ? e.key === 'Escape' && setOpen(false) : !ref.current?.contains(e.target) && setOpen(false));
    document.addEventListener('mousedown', close);
    document.addEventListener('keydown', close);
    return () => {
      document.removeEventListener('mousedown', close);
      document.removeEventListener('keydown', close);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative">
      <button type="button" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)} className="rounded-xl">
        {trigger}
      </button>
      {open && (
        <div role="menu" className={cn('absolute z-40 mt-2 min-w-48 rounded-xl border border-line bg-surface p-1.5 shadow-lift', align === 'right' ? 'right-0' : 'left-0')}>
          {items.map((it) =>
            it.divider ? (
              <div key={it.key || 'd'} className="my-1 border-t border-line" />
            ) : (
              <button
                key={it.label}
                role="menuitem"
                type="button"
                onClick={() => {
                  setOpen(false);
                  it.onClick?.();
                }}
                className={cn('flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition hover:bg-surface2', it.danger && 'text-danger')}
              >
                {it.icon}
                {it.label}
              </button>
            )
          )}
        </div>
      )}
    </div>
  );
}
