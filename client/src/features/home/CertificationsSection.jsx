import { useState } from 'react';
import { Award, ExternalLink } from 'lucide-react';
import Section from './Section';
import SectionHeading from '../../components/common/SectionHeading';
import Lightbox from '../../components/common/Lightbox';
import { useItems } from '../../hooks';
import { fmtMonthYear } from '../../lib/utils';

export function CertificationGrid({ items }) {
  const [view, setView] = useState(null);
  return (
    <>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((c) => (
          <li key={c._id} className="card flex flex-col p-6">
            <span className="mb-4 grid h-10 w-10 place-items-center rounded-xl bg-surface2 text-accent"><Award className="h-5 w-5" /></span>
            <h3 className="font-display font-bold leading-snug">{c.title}</h3>
            <p className="mt-1 text-sm text-muted">{c.organization}{c.issueDate ? ` · ${fmtMonthYear(c.issueDate)}` : ''}</p>
            {c.credentialId && <p className="mt-2 font-mono text-xs text-muted">ID: {c.credentialId}</p>}
            <div className="mt-auto flex gap-4 pt-5 text-sm">
              {c.image && <button type="button" onClick={() => setView(c.image)} className="link-underline">View certificate</button>}
              {c.file && <a href={c.file} target="_blank" rel="noopener noreferrer" className="link-underline">PDF</a>}
              {c.url && <a href={c.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 link-underline">Verify <ExternalLink className="h-3.5 w-3.5" /></a>}
            </div>
          </li>
        ))}
      </ul>
      {view && <Lightbox images={[view]} index={0} onClose={() => setView(null)} onChange={() => {}} />}
    </>
  );
}

export default function CertificationsSection() {
  const q = useItems('certifications', '/certifications', { limit: 30 });
  if (!q.items.length) return null;
  return (
    <Section id="certifications">
      <SectionHeading title="Certifications" />
      <CertificationGrid items={q.items} />
    </Section>
  );
}
