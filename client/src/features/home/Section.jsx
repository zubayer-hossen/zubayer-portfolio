import { cn } from '../../lib/utils';

export default function Section({ id, className, children, tone }) {
  return (
    <section id={id} className={cn('section', tone === 'alt' && 'border-y border-line bg-surface/40', className)}>
      <div className="container-x">{children}</div>
    </section>
  );
}
