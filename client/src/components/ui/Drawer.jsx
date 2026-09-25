import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useLockBody } from '../../hooks';
import { cn } from '../../lib/utils';

export default function Drawer({ open, onClose, title, side = 'right', children, className }) {
  useLockBody(open);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  const from = side === 'left' ? '-100%' : '100%';
  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[80]">
          <motion.div className="absolute inset-0 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} />
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-label={title}
            initial={{ x: from }}
            animate={{ x: 0 }}
            exit={{ x: from }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={cn('absolute top-0 flex h-full w-[86%] max-w-sm flex-col border-line bg-surface shadow-lift', side === 'left' ? 'left-0 border-r' : 'right-0 border-l', className)}
          >
            <div className="flex items-center justify-between px-5 py-4">
              <span className="font-display text-lg font-bold">{title}</span>
              <button type="button" onClick={onClose} aria-label="Close menu" className="rounded-lg p-1.5 text-muted hover:bg-surface2 hover:text-ink">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-5 pb-8">{children}</div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
