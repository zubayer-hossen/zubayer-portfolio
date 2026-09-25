import { hashHue, initials } from '../../lib/utils';

/** Generated cover for items without an image, so cards never look broken. */
export default function CoverArt({ title = '', className = '' }) {
  const h = hashHue(title);
  return (
    <div
      className={`relative grid place-items-center overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, hsl(${h} 45% 16%), hsl(${(h + 50) % 360} 55% 24%))` }}
      aria-hidden="true"
    >
      <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'radial-gradient(rgba(255,255,255,.35) 1px, transparent 1px)', backgroundSize: '18px 18px' }} />
      <span className="relative font-display text-5xl font-extrabold text-white/80">{initials(title)}</span>
    </div>
  );
}
