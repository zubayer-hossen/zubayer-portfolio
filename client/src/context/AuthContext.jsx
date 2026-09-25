import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const qc = useQueryClient();
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState('idle'); // idle | loading | authed | guest

  const check = useCallback(async () => {
    setStatus('loading');
    try {
      const { data } = await api.get('/auth/me');
      setUser(data.data);
      setStatus('authed');
    } catch (e) {
      if (e.response?.status === 401) {
        try {
          const r = await api.post('/auth/refresh');
          setUser(r.data.data);
          setStatus('authed');
          return;
        } catch {
          /* fall through */
        }
      }
      setUser(null);
      setStatus('guest');
    }
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    setUser(data.data);
    setStatus('authed');
    return data.data;
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } finally {
      setUser(null);
      setStatus('guest');
      qc.removeQueries({ predicate: (q) => String(q.queryKey[0]).startsWith('admin') });
    }
  }, [qc]);

  useEffect(() => {
    const onExpired = () => {
      setUser(null);
      setStatus('guest');
    };
    window.addEventListener('auth:expired', onExpired);
    return () => window.removeEventListener('auth:expired', onExpired);
  }, []);

  const value = useMemo(
    () => ({ user, status, check, login, logout, can: (...roles) => Boolean(user && roles.includes(user.role)) }),
    [user, status, check, login, logout]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
