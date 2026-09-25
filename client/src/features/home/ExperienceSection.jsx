import { Briefcase } from 'lucide-react';
import Section from './Section';
import SectionHeading from '../../components/common/SectionHeading';
import { EmptyState, QueryBoundary } from '../../components/ui/States';
import { Skeleton } from '../../components/ui/Skeleton';
import Button from '../../components/ui/Button';
import { useItems } from '../../hooks';
import { fmtMonthYear } from '../../lib/utils';

export function ExperienceTimeline({ items }) {
  return (
    <ol className="space-y-6">
      {items.map((e) => (
        <li key={e._id} className="grid gap-3 md:grid-cols-[180px_1fr] md:gap-8">
          <p className="pt-1 text-sm text-muted">{fmtMonthYear(e.startDate)} – {e.current ? 'Present' : fmtMonthYear(e.endDate) || '—'}</p>
          <div className="card p-6">
            <h3 className="font-display text-xl font-bold">{e.position}</h3>
            <p className="text-sm text-muted">{e.company}{e.type ? ` · ${e.type}` : ''}{e.location ? ` · ${e.location}` : ''}</p>
            {e.description && <p className="mt-3 text-sm leading-relaxed">{e.description}</p>}
            {e.responsibilities?.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-muted">{e.responsibilities.map((r) => <li key={r}>{r}</li>)}</ul>}
            {e.achievements?.length > 0 && <ul className="mt-3 list-disc space-y-1 pl-5 text-sm">{e.achievements.map((r) => <li key={r}>{r}</li>)}</ul>}
            {e.technologies?.length > 0 && <ul className="mt-4 flex flex-wrap gap-1.5">{e.technologies.map((t) => <li key={t} className="badge">{t}</li>)}</ul>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export default function ExperienceSection() {
  const q = useItems('experience', '/experience', { limit: 50 });
  return (
    <Section id="experience">
      <SectionHeading title="Experience" />
      <QueryBoundary
        query={q}
        skeleton={<Skeleton className="h-40" />}
        isEmpty={!q.items.length}
        empty={
          <EmptyState
            icon={Briefcase}
            title="Building experience through projects and training"
            text="I am looking for my first professional developer role. In the meantime, my projects show how I work."
            action={<Button to="/projects" variant="secondary">See my projects</Button>}
          />
        }
      >
        <ExperienceTimeline items={q.items} />
      </QueryBoundary>
    </Section>
  );
}
