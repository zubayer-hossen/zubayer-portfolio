import { createContext, useCallback, useContext, useMemo, useState } from 'react';

const ThemeContext = createContext({ theme: 'dark', toggle: () => {}, setTheme: () => {} });

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(() => document.documentElement.dataset.theme || 'dark');

  const setTheme = useCallback((next, { animate = true, persist = true } = {}) => {
    const el = document.documentElement;
    if (animate) {
      el.classList.add('theme-transition');
      window.setTimeout(() => el.classList.remove('theme-transition'), 450);
    }
    el.dataset.theme = next;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'dark' ? '#070A12' : '#F5F6FA');
    if (persist) {
      try {
        localStorage.setItem('theme', next);
      } catch {
        /* ignore */
      }
    }
    setThemeState(next);
  }, []);

  const toggle = useCallback(() => setTheme(theme === 'dark' ? 'light' : 'dark'), [theme, setTheme]);
  const value = useMemo(() => ({ theme, toggle, setTheme }), [theme, toggle, setTheme]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
