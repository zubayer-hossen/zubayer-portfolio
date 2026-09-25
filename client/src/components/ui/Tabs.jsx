import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

export default function Tabs({ tabs, value, onChange, id = 'tabs', className }) {
  return (
    <div role="tablist" className={cn('no-scrollbar flex gap-1 overflow-x-auto rounded-xl border border-line bg-surface p-1', className)}>
      {tabs.map((t) => {
        const active = t.id === value;
        return (
          <button
            key={t.id}
            role="tab"
            type="button"
            aria-selected={active}
            onClick={() => onChange(t.id)}
            className={cn('relative whitespace-nowrap rounded-lg px-3.5 py-1.5 text-sm font-medium transition', active ? 'text-accent-ink' : 'text-muted hover:text-ink')}
          >
            {active && <motion.span layoutId={`${id}-pill`} className="absolute inset-0 rounded-lg bg-accent" transition={{ type: 'spring', stiffness: 400, damping: 34 }} />}
            <span className="relative">
              {t.label}
              {t.count != null && <span className="ml-1.5 text-xs opacity-70">{t.count}</span>}
            </span>
          </button>
        );
      })}
    </div>
  );
}
