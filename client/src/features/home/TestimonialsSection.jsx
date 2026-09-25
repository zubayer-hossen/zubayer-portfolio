import { Star } from 'lucide-react';
import Section from './Section';
import SectionHeading from '../../components/common/SectionHeading';
import { useItems } from '../../hooks';
import { img } from '../../lib/api';
import { initials } from '../../lib/utils';

export default function TestimonialsSection() {
  const q = useItems('testimonials', '/testimonials', { limit: 6 });
  if (!q.items.length) return null;
  return (
    <Section id="testimonials" tone="alt">
      <SectionHeading title="Kind words" />
      <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {q.items.map((t) => (
          <li key={t._id} className="card flex flex-col p-6">
            <p className="flex gap-0.5 text-warn" aria-label={`${t.rating} out of 5 stars`}>
              {Array.from({ length: t.rating || 5 }, (_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
            </p>
            <blockquote className="mt-4 flex-1 text-[15px] leading-relaxed">“{t.text}”</blockquote>
            <figcaption className="mt-5 flex items-center gap-3">
              {t.photo ? <img src={img(t.photo, 96)} alt="" className="h-10 w-10 rounded-full object-cover" /> : <span className="grid h-10 w-10 place-items-center rounded-full bg-surface2 text-sm font-bold" aria-hidden="true">{initials(t.clientName)}</span>}
              <span className="text-sm"><span className="block font-semibold">{t.clientName}</span><span className="text-muted">{[t.position, t.company].filter(Boolean).join(', ')}</span></span>
            </figcaption>
          </li>
        ))}
      </ul>
    </Section>
  );
}
