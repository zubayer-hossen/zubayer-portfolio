import { useEffect, useState } from 'react';
import { motion, useMotionValue, useReducedMotion, useSpring } from 'framer-motion';
import { useMediaQuery } from '../../hooks';

/** Soft follower ring for mouse users. Native cursor stays visible; disabled for touch and reduced motion. */
export default function CustomCursor() {
  const fine = useMediaQuery('(hover: hover) and (pointer: fine)');
  const reduce = useReducedMotion();
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });
  const [hot, setHot] = useState(false);

  useEffect(() => {
    if (!fine || reduce) return undefined;
    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) => setHot(Boolean(e.target.closest?.('a, button, [role="button"], input, textarea, select, label')));
    window.addEventListener('mousemove', move, { passive: true });
    window.addEventListener('mouseover', over, { passive: true });
    return () => {
      window.removeEventListener('mousemove', move);
      window.removeEventListener('mouseover', over);
    };
  }, [fine, reduce, x, y]);

  if (!fine || reduce) return null;
  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[150] rounded-full border border-accent/70"
      style={{ x: sx, y: sy, translateX: '-50%', translateY: '-50%' }}
      animate={{ width: hot ? 46 : 26, height: hot ? 46 : 26, backgroundColor: hot ? 'rgb(140 156 255 / 0.12)' : 'rgb(140 156 255 / 0)' }}
      transition={{ duration: 0.18 }}
    />
  );
}
