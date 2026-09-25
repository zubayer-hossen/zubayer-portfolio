import Section from './Section';
import SectionHeading from '../../components/common/SectionHeading';
import { serviceIcon } from '../../lib/icons';
import { QueryBoundary, EmptyState } from '../../components/ui/States';
import { GridSkeleton } from '../../components/ui/Skeleton';
import { useItems } from '../../hooks';

export function ServiceGrid({ items }) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {items.map((s) => {
        const Icon = serviceIcon(s.icon);
        return (
          <li key={s._id} className="card card-hover flex flex-col p-6">
            <span className="mb-5 grid h-11 w-11 place-items-center rounded-xl bg-accent/10 text-accent"><Icon className="h-5 w-5" /></span>
            <h3 className="font-display text-lg font-bold leading-snug">{s.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">{s.description}</p>
            {s.features?.length > 0 && <ul className="mt-4 space-y-1 text-sm text-ink/80">{s.features.map((f) => <li key={f} className="flex gap-2"><span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />{f}</li>)}</ul>}
          </li>
        );
      })}
    </ul>
  );
}

export default function ServicesSection() {
  const q = useItems('services', '/services', { limit: 20 });
  return (
    <Section id="services" tone="alt">
      <SectionHeading title="What I can build for you" text="From a single API to a complete web product." action={{ to: '/services', label: 'Details' }} />
      <QueryBoundary query={q} skeleton={<GridSkeleton count={4} />} isEmpty={!q.items.length} empty={<EmptyState title="Services coming soon" />}>
        <ServiceGrid items={q.items} />
      </QueryBoundary>
    </Section>
  );
}
