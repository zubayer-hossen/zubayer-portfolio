import { useState } from 'react';
import { useTheme } from '../../context/ThemeContext';
import { hashHue, initials } from '../../lib/utils';

/** Monochrome brand icon from simple-icons; falls back to a coloured monogram tile. */
export default function TechIcon({ name, iconSlug, iconUrl, size = 28 }) {
  const { theme } = useTheme();
  const [failed, setFailed] = useState(false);
  const color = theme === 'dark' ? 'E7EBF5' : '0B1020';
  const src = iconUrl || (iconSlug ? `https://cdn.simpleicons.org/${iconSlug}/${color}` : null);

  if (src && !failed) {
    return <img src={src} alt="" width={size} height={size} loading="lazy" decoding="async" onError={() => setFailed(true)} style={{ width: size, height: size }} />;
  }
  const hue = hashHue(name);
  return (
    <span
      aria-hidden="true"
      className="grid shrink-0 place-items-center rounded-lg font-display font-bold"
      style={{ width: size, height: size, fontSize: size * 0.4, background: `hsl(${hue} 70% 55% / .16)`, color: `hsl(${hue} 75% 65%)` }}
    >
      {initials(name)}
    </span>
  );
}
