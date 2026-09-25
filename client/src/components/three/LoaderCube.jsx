import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useT } from '../../i18n';

const FACES = ['{ }', '</>', 'ZH', '=>', '01', '[ ]'];

/** Pure CSS 3D cube loader (no WebGL). Waits for `ready` before finishing. */
export default function LoaderCube({ ready, onDone }) {
  const reduce = useReducedMotion();
  const { t } = useT();
  const [pct, setPct] = useState(0);
  const readyRef = useRef(ready);
  readyRef.current = ready;
  const doneRef = useRef(onDone);
  doneRef.current = onDone;

  useEffect(() => {
    const start = performance.now();
    const duration = reduce ? 500 : 1800;
    const id = setInterval(() => {
      const p = Math.min(1, (performance.now() - start) / duration);
      const eased = 1 - (1 - p) ** 3;
      const v = Math.min(readyRef.current ? 100 : 92, Math.round(eased * 100));
      setPct(v);
      if (v >= 100) {
        clearInterval(id);
        setTimeout(() => doneRef.current?.(), 250);
      }
    }, 30);
    return () => clearInterval(id);
  }, [reduce]);

  return (
    <motion.div
      role="status"
      aria-live="polite"
      className="fixed inset-0 z-[200] grid place-items-center bg-bg"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.04 }}
      transition={{ duration: 0.45, ease: 'easeInOut' }}
    >
      <div className="flex flex-col items-center gap-9">
        <div className="cube-scene" aria-hidden="true">
          <div className="cube">
            {FACES.map((f) => <div key={f} className="cube-face">{f}</div>)}
          </div>
        </div>
        <div className="w-56 text-center">
          <p className="text-sm text-muted">{t('loading')}</p>
          <div className="mt-4 h-px w-full overflow-hidden bg-line">
            <div className="h-full bg-accent transition-[width] duration-100" style={{ width: `${pct}%` }} />
          </div>
          <p className="mt-3 font-mono text-xs tabular-nums text-muted">{String(pct).padStart(2, '0')}%</p>
        </div>
      </div>
    </motion.div>
  );
}
