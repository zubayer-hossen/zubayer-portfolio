import { useState } from 'react';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { useSite } from '../context/SiteContext';
import { cn, isExternal } from '../lib/utils';

const tone = { info: 'bg-accent/10 text-ink', success: 'bg-ok/10 text-ink', warning: 'bg-warn/10 text-ink' };

export default function Announcement() {
  const { announcement: a } = useSite();
  const key = a ? `ann-${a._id}` : '';
  const [hidden, setHidden] = useState(() => {
    try {
      return Boolean(key && sessionStorage.getItem(key));
    } catch {
      return false;
    }
  });
  if (!a || hidden) return null;

  const close = () => {
    setHidden(true);
    try {
      sessionStorage.setItem(key, '1');
    } catch {
      /* ignore */
    }
  };
  const LinkTag = isExternal(a.link) ? 'a' : Link;
  const linkProps = isExternal(a.link) ? { href: a.link, target: '_blank', rel: 'noopener noreferrer' } : { to: a.link };

  return (
    <div role="status" className={cn('relative border-b border-line px-10 py-2 text-center text-sm', tone[a.type] || tone.info)}>
      <span>{a.text}</span>
      {a.link && (
        <LinkTag {...linkProps} className="ml-2 font-medium text-accent underline underline-offset-4">
          {a.linkLabel || 'Learn more'}
        </LinkTag>
      )}
      <button type="button" onClick={close} aria-label="Dismiss announcement" className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted hover:text-ink">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
