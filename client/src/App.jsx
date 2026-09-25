import { Suspense, useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useSite } from './context/SiteContext';
import AppRoutes from './router';
import LoaderCube from './components/three/LoaderCube';
import CustomCursor from './components/effects/CustomCursor';
import CommandPalette from './features/search/CommandPalette';
import { NetworkError } from './pages/ErrorPages';

const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

function seen() {
  try {
    return sessionStorage.getItem('loaded') === '1';
  } catch {
    return false;
  }
}

export default function App() {
  const { ready, error, settings, refetch } = useSite();
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith('/admin');
  const [loaded, setLoaded] = useState(() => isAdmin || seen());
  const seq = useRef([]);
  const features = settings.features || {};

  // Admin can switch the loading screen off.
  useEffect(() => {
    if (ready && features.loader === false) setLoaded(true);
  }, [ready, features.loader]);

  useEffect(() => {
    if (features.konami === false) return undefined;
    const onKey = (e) => {
      seq.current = [...seq.current, e.key.length === 1 ? e.key.toLowerCase() : e.key].slice(-KONAMI.length);
      if (seq.current.join() === KONAMI.join()) {
        document.documentElement.classList.add('konami');
        setTimeout(() => document.documentElement.classList.remove('konami'), 4200);
        toast('You found the secret. Thanks for looking closely.', { icon: '🎮' });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [features.konami]);

  const finish = () => {
    setLoaded(true);
    try {
      sessionStorage.setItem('loaded', '1');
    } catch {
      /* ignore */
    }
  };

  if (error && !ready) return <NetworkError onRetry={refetch} />;

  return (
    <>
      <AnimatePresence>{!loaded && <LoaderCube key="loader" ready={ready} onDone={finish} />}</AnimatePresence>
      {ready && (
        <>
          <Suspense fallback={null}>
            <AppRoutes />
          </Suspense>
          {!isAdmin && <CommandPalette />}
          {!isAdmin && features.customCursor !== false && <CustomCursor />}
        </>
      )}
    </>
  );
}
