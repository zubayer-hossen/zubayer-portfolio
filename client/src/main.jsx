import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import App from './App';
import ErrorBoundary from './components/common/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import { SiteProvider } from './context/SiteContext';
import { AuthProvider } from './context/AuthContext';
import { I18nProvider } from './i18n';
import './styles/globals.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 60_000,
      retry: (count, err) => {
        const status = err?.response?.status;
        if (status && status >= 400 && status < 500) return false;
        return count < 1;
      },
    },
  },
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <I18nProvider>
              <SiteProvider>
                <AuthProvider>
                  <BrowserRouter>
                    <App />
                    <Toaster
                      position="bottom-right"
                      toastOptions={{ style: { background: 'rgb(var(--surface2))', color: 'rgb(var(--ink))', border: '1px solid rgb(var(--line))', borderRadius: '12px', fontSize: '14px' } }}
                    />
                  </BrowserRouter>
                </AuthProvider>
              </SiteProvider>
            </I18nProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  </StrictMode>
);
