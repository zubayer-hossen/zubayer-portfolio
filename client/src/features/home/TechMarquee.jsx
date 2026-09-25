import { useReducedMotion } from 'framer-motion';
import { useItems } from '../../hooks';
import TechIcon from '../../components/common/TechIcon';

export default function TechMarquee() {
  const reduce = useReducedMotion();
  const { items } = useItems('skills-marquee', '/skills', { limit: 40 });
  if (!items.length) return null;
  const row = (hidden) => (
    <ul className="flex shrink-0 items-center gap-4 pr-4" aria-hidden={hidden || undefined}>
      {items.map((s) => (
        <li key={s._id} className="flex items-center gap-2.5 rounded-full border border-line bg-surface px-4 py-2 text-sm text-muted">
          <TechIcon name={s.name} iconSlug={s.iconSlug} iconUrl={s.iconUrl} size={20} />
          {s.name}
        </li>
      ))}
    </ul>
  );
  if (reduce) return <div className="container-x flex flex-wrap gap-3 py-10">{items.map((s) => <span key={s._id} className="badge">{s.name}</span>)}</div>;
  return (
    <div className="group relative overflow-hidden py-10" aria-label="Technologies I work with">
      <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
        {row(false)}
        {row(true)}
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-bg to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-bg to-transparent" />
    </div>
  );
}
