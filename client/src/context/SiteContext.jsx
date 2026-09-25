import { createContext, useContext, useEffect, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '../lib/api';
import { useTheme } from './ThemeContext';

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const { setTheme } = useTheme();
  const query = useQuery({ queryKey: ['site'], queryFn: () => get('/site'), staleTime: 60_000, retry: 1 });

  // Use the admin-configured default theme unless the visitor already picked one.
  useEffect(() => {
    const def = query.data?.settings?.defaultTheme;
    if (!def) return;
    let saved = null;
    try {
      saved = localStorage.getItem('theme');
    } catch {
      /* ignore */
    }
    if (!saved) setTheme(def, { animate: false, persist: false });
  }, [query.data?.settings?.defaultTheme, setTheme]);

  const value = useMemo(() => {
    const d = query.data || {};
    return {
      profile: d.profile || {},
      hero: d.hero || {},
      about: d.about || {},
      settings: d.settings || {},
      seo: d.seo || {},
      resume: d.resume || {},
      socialLinks: d.socialLinks || [],
      announcement: d.announcement || null,
      counts: d.counts || {},
      isLoading: query.isLoading,
      error: query.error,
      ready: Boolean(query.data),
      refetch: query.refetch,
    };
  }, [query.data, query.isLoading, query.error, query.refetch]);

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export const useSite = () => useContext(SiteContext);
