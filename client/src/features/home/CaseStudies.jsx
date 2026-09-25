import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Section from './Section';
import SectionHeading from '../../components/common/SectionHeading';
import { useItems } from '../../hooks';

export default function CaseStudies() {
  const q = useItems('projects-cases', '/projects', { caseStudy: true, limit: 3 });
  if (!q.items.length) return null;
  return (
    <Section id="case-studies" tone="alt">
      <SectionHeading title="Case studies" text="Deeper write-ups: the problem, the decisions and what I learned." />
      <div className="grid gap-4">
        {q.items.map((p) => (
          <Link key={p._id} to={`/projects/${p.slug}#case-study`} className="card card-hover group flex items-center justify-between gap-6 p-6">
            <div>
              <h3 className="font-display text-xl font-bold">{p.title}</h3>
              <p className="mt-1.5 line-clamp-2 max-w-2xl text-sm text-muted">{p.shortDescription}</p>
            </div>
            <ArrowUpRight className="h-5 w-5 shrink-0 text-muted transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" aria-label="Read case study" />
          </Link>
        ))}
      </div>
    </Section>
  );
}
