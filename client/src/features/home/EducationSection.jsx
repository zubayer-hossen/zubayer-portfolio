import { GraduationCap } from 'lucide-react';
import Section from './Section';
import SectionHeading from '../../components/common/SectionHeading';
import { useItems } from '../../hooks';

export function EducationList({ items }) {
  return (
    <ul className="grid gap-4 md:grid-cols-2">
      {items.map((e) => (
        <li key={e._id} className="card flex gap-4 p-6">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-surface2 text-accent"><GraduationCap className="h-5 w-5" /></span>
          <div>
            <h3 className="font-display font-bold">{e.degree}{e.subject ? `, ${e.subject}` : ''}</h3>
            <p className="text-sm text-muted">{e.institution}</p>
            <p className="mt-1 text-xs text-muted">{[e.startYear, e.endYear].filter(Boolean).join(' – ')}{e.result ? ` · ${e.result}` : ''}</p>
            {e.description && <p className="mt-2 text-sm text-muted">{e.description}</p>}
          </div>
        </li>
      ))}
    </ul>
  );
}

export default function EducationSection() {
  const q = useItems('education', '/education', { limit: 20 });
  if (!q.items.length) return null;
  return (
    <Section id="education" tone="alt">
      <SectionHeading title="Education" />
      <EducationList items={q.items} />
    </Section>
  );
}
