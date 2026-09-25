import { Suspense } from 'react';
import { useLocation, useOutlet } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import Announcement from './Announcement';
import Navbar from './Navbar';
import Footer from './Footer';
import { PageSkeleton } from '../components/ui/Skeleton';
import { useEffect } from 'react';
import { trackPage } from '../lib/track';

export default function PublicLayout() {
  const location = useLocation();
  const outlet = useOutlet();
  const reduce = useReducedMotion();

  useEffect(() => {
    trackPage(location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only z-[300] rounded-lg bg-accent px-4 py-2 text-accent-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to content
      </a>
      <div className="no-print"><Announcement /></div>
      <div className="no-print"><Navbar /></div>
      <AnimatePresence mode="wait" initial={false} onExitComplete={() => window.scrollTo(0, 0)}>
        <motion.main
          id="main"
          key={location.pathname}
          className="flex-1"
          initial={reduce ? false : { opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.22 }}
        >
          <Suspense fallback={<PageSkeleton />}>{outlet}</Suspense>
        </motion.main>
      </AnimatePresence>
      <Footer />
    </div>
  );
}
