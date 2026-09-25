import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { CornerDownLeft, FileText, FolderKanban, Search, Sparkles, Wrench } from 'lucide-react';
import { get } from '../../lib/api';
import { useDebounce } from '../../hooks';
import { useSite } from '../../context/SiteContext';
import { useT } from '../../i18n';
import { cn } from '../../lib/utils';

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { settings } = useSite();
  const { t } = useT();
  const term = useDebounce(q.trim(), 250);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => !o);
      }
      if (e.key === 'Escape') setOpen(false);
    };
    const onOpen = () => setOpen(true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('open-search', onOpen);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('open-search', onOpen);
    };
  }, []);

  useEffect(() => {
    if (open) {
      setQ('');
      setActive(0);
      setTimeout(() => inputRef.current?.focus(), 30);
    }
  }, [open]);

  const { data, isFetching } = useQuery({ queryKey: ['search', term], queryFn: () => get('/search', { q: term }), enabled: open && term.length >= 2, staleTime: 30_000 });

  const results = useMemo(() => {
    if (term.length < 2) return (settings.navigation || []).map((n) => ({ group: 'Pages', title: n.label, to: n.path, icon: Sparkles }));
    if (!data) return [];
    return [
      ...data.projects.map((p) => ({ group: 'Projects', title: p.title, sub: p.shortDescription, to: `/projects/${p.slug}`, icon: FolderKanban })),
      ...data.blogs.map((b) => ({ group: 'Articles', title: b.title, sub: b.excerpt, to: `/blog/${b.slug}`, icon: FileText })),
      ...data.skills.map((s) => ({ group: 'Skills', title: s.name, sub: s.category, to: '/skills', icon: Wrench })),
      ...data.services.map((s) => ({ group: 'Services', title: s.title, sub: s.description, to: '/services', icon: Wrench })),
    ];
  }, [data, term, settings.navigation]);

  useEffect(() => setActive(0), [term]);

  const go = (r) => {
    setOpen(false);
    navigate(r.to);
  };
  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === 'Enter' && results[active]) go(results[active]);
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[110] flex items-start justify-center px-4 pt-[12vh]">
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(false)} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={t('search')}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-surface shadow-lift"
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <Search className="h-5 w-5 text-muted" />
              <input
                ref={inputRef}
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder={t('searchPlaceholder')}
                aria-label={t('search')}
                className="h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted/70"
              />
              <kbd className="rounded-md border border-line px-1.5 py-0.5 font-mono text-[11px] text-muted">Esc</kbd>
            </div>
            <ul className="max-h-[50vh] overflow-y-auto p-2" role="listbox">
              {term.length >= 2 && !isFetching && results.length === 0 && <li className="px-4 py-10 text-center text-sm text-muted">No results for “{term}”.</li>}
              {results.map((r, i) => {
                const Icon = r.icon;
                const showGroup = i === 0 || results[i - 1].group !== r.group;
                return (
                  <li key={`${r.group}-${r.title}-${i}`} role="option" aria-selected={i === active}>
                    {showGroup && <p className="px-3 pb-1 pt-3 text-xs font-medium text-muted">{r.group}</p>}
                    <button type="button" onMouseEnter={() => setActive(i)} onClick={() => go(r)} className={cn('flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition', i === active ? 'bg-surface2' : '')}>
                      <Icon className="h-4 w-4 shrink-0 text-muted" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">{r.title}</span>
                        {r.sub && <span className="block truncate text-xs text-muted">{r.sub}</span>}
                      </span>
                      {i === active && <CornerDownLeft className="h-4 w-4 text-muted" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
