import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { get } from '../lib/api';

export function useDebounce(value, delay = 300) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setV(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return v;
}

export function useMediaQuery(query) {
  const [matches, setMatches] = useState(() => (typeof window !== 'undefined' ? window.matchMedia(query).matches : false));
  useEffect(() => {
    const mq = window.matchMedia(query);
    const onChange = () => setMatches(mq.matches);
    onChange();
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [query]);
  return matches;
}

/** Thin wrapper: GET `url` with `params`, cached by TanStack Query. */
export function useApi(key, url, params, options = {}) {
  return useQuery({
    queryKey: [key, params ?? null],
    queryFn: () => get(url, params),
    staleTime: 60_000,
    ...options,
  });
}

export const useItems = (key, url, params, options) => {
  const q = useApi(key, url, params, options);
  return { ...q, items: q.data?.items ?? [], pagination: q.data?.pagination };
};

export function useLockBody(locked) {
  useEffect(() => {
    if (!locked) return undefined;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [locked]);
}
