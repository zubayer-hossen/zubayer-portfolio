import { Link } from 'react-router-dom';
import { useSite } from '../context/SiteContext';
import SocialLinks from '../components/common/SocialLinks';
import { initials } from '../lib/utils';

export default function Footer() {
  const { settings, profile, socialLinks, hero, resume } = useSite();
  const nav = (settings.navigation || []).filter((n) => !n.cta);
  const footer = settings.footer || {};
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-line no-print">
      <div className="container-x grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5 font-display text-lg font-bold">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-accent text-sm font-extrabold text-accent-ink">{initials(profile.name || settings.siteName)}</span>
            {settings.siteName || profile.name}
          </div>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">{footer.bio}</p>
          {hero.availabilityStatus && (
            <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted">
              <span className="h-2 w-2 animate-pulseDot rounded-full bg-ok" aria-hidden="true" />
              {hero.availabilityText}
            </p>
          )}
        </div>

        <nav aria-label="Footer">
          <h2 className="mb-3 font-display text-sm font-bold">Explore</h2>
          <ul className="space-y-2 text-sm text-muted">
            {nav.map((n) => (
              <li key={n.path}><Link to={n.path} className="transition hover:text-ink">{n.label}</Link></li>
            ))}
            <li><Link to="/experience" className="transition hover:text-ink">Experience</Link></li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 font-display text-sm font-bold">Connect</h2>
          <ul className="mb-4 space-y-2 text-sm text-muted">
            {profile.email && <li><a href={`mailto:${profile.email}`} className="transition hover:text-ink">{profile.email}</a></li>}
            {profile.location && <li>{profile.location}</li>}
            <li><Link to="/resume" className="transition hover:text-ink">Resume{resume.version ? ` (${resume.version})` : ''}</Link></li>
          </ul>
          <SocialLinks links={socialLinks} />
        </div>
      </div>
      <div className="border-t border-line py-5 text-center text-xs text-muted">
        © {year} {footer.copyright || settings.siteName}. All rights reserved.
      </div>
    </footer>
  );
}
