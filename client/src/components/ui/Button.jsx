import { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useReducedMotion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export default function Button({ to, href, variant = 'primary', size, magnetic = false, loading = false, className, children, ...rest }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();

  const onMove = (e) => {
    if (!magnetic || reduce || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    ref.current.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.16}px, ${(e.clientY - r.top - r.height / 2) * 0.26}px)`;
  };
  const onLeave = () => {
    if (ref.current) ref.current.style.transform = '';
  };

  const props = {
    ref,
    className: cn('btn', `btn-${variant}`, size === 'sm' && 'btn-sm', className),
    onMouseMove: onMove,
    onMouseLeave: onLeave,
    ...rest,
  };
  const content = (
    <>
      {loading && <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />}
      {children}
    </>
  );

  if (to) return <Link to={to} {...props}>{content}</Link>;
  if (href) {
    const external = /^https?:\/\//.test(href);
    return (
      <a href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...props}>
        {content}
      </a>
    );
  }
  return (
    <button type="button" {...props} disabled={loading || rest.disabled}>
      {content}
    </button>
  );
}
