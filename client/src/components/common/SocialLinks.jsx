import { socialIcon } from '../../lib/icons';
import { cn } from '../../lib/utils';

export default function SocialLinks({ links = [], className }) {
  const visible = links.filter((l) => l.url && l.isActive !== false);
  if (!visible.length) return null;
  return (
    <ul className={cn('flex flex-wrap items-center gap-2', className)}>
      {visible.map((l) => {
        const Icon = socialIcon(l.platform);
        return (
          <li key={l._id || l.platform}>
            <a
              href={l.platform === 'email' && !l.url.startsWith('mailto:') ? `mailto:${l.url}` : l.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={l.label || l.platform}
              className="grid h-10 w-10 place-items-center rounded-xl border border-line text-muted transition hover:border-accent/70 hover:text-accent"
            >
              <Icon className="h-[18px] w-[18px]" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}
