import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Menu, Moon, Search, Sun } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { useTheme } from '../context/ThemeContext';
import { useT } from '../i18n';
import { cn, initials } from '../lib/utils';
import Button from '../components/ui/Button';
import Drawer from '../components/ui/Drawer';

export default function Navbar() {
  const { settings, profile } = useSite();
  const { theme, toggle } = useTheme();
  const { t } = useT();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const nav = settings.navigation || [];
  const links = nav.filter((n) => !n.cta);
  const cta = nav.find((n) => n.cta);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const openSearch = () => window.dispatchEvent(new Event('open-search'));

  return (
    <header className={cn('sticky top-0 z-50 transition-all duration-300', scrolled ? 'glass border-x-0 border-t-0' : 'border-b border-transparent')}>
      <div className="container-x flex h-16 items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 font-display text-lg font-bold" aria-label={`${settings.siteName || profile.name || 'Home'} – home`}>
          {profile.logo ? (
            <img src={profile.logo} alt="" className="h-8 w-8 rounded-lg object-cover" />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-extrabold text-accent-ink">{initials(profile.name || settings.siteName)}</span>
          )}
          <span className="hidden sm:inline">{settings.siteName || profile.name}</span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-0.5 lg:flex">
          {links.map((n) => (
            <NavLink key={n.path} to={n.path} end={n.path === '/'} className={({ isActive }) => cn('relative rounded-lg px-3 py-2 text-sm transition', isActive ? 'text-ink' : 'text-muted hover:text-ink')}>
              {({ isActive }) => (
                <>
                  {n.label}
                  {isActive && <motion.span layoutId="nav-dot" className="absolute inset-x-3 -bottom-0.5 h-0.5 rounded-full bg-accent" />}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-1.5">
          <button type="button" onClick={openSearch} aria-label={t('search')} className="hidden items-center gap-2 rounded-xl border border-line px-3 py-2 text-sm text-muted transition hover:border-accent/60 hover:text-ink sm:flex">
            <Search className="h-4 w-4" />
            <kbd className="font-mono text-[11px]">Ctrl K</kbd>
          </button>
          <button type="button" onClick={openSearch} aria-label={t('search')} className="grid h-10 w-10 place-items-center rounded-xl text-muted hover:bg-surface2 hover:text-ink sm:hidden">
            <Search className="h-5 w-5" />
          </button>
          <button type="button" onClick={toggle} aria-label={t('toggleTheme')} className="grid h-10 w-10 place-items-center rounded-xl text-muted transition hover:bg-surface2 hover:text-ink">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
          {cta && <Button to={cta.path} size="sm" magnetic className="ml-1 hidden lg:inline-flex">{cta.label}</Button>}
          <button type="button" onClick={() => setOpen(true)} aria-label={t('menu')} className="grid h-10 w-10 place-items-center rounded-xl text-muted hover:bg-surface2 hover:text-ink lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </div>

      <Drawer open={open} onClose={() => setOpen(false)} title={t('menu')}>
        <nav className="flex flex-col gap-1" aria-label="Mobile">
          {nav.map((n) => (
            <NavLink key={n.path} to={n.path} end={n.path === '/'} onClick={() => setOpen(false)} className={({ isActive }) => cn('rounded-xl px-4 py-3 font-display text-lg font-semibold transition', isActive ? 'bg-accent/10 text-accent' : 'text-ink/80 hover:bg-surface2')}>
              {n.label}
            </NavLink>
          ))}
        </nav>
      </Drawer>
    </header>
  );
}
