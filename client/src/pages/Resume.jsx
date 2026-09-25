import { Download, Printer } from 'lucide-react';
import SEO from '../components/common/SEO';
import Button from '../components/ui/Button';
import { useSite } from '../context/SiteContext';
import { useItems } from '../hooks';
import { fmtDate, fmtMonthYear } from '../lib/utils';

function Block({ title, children }) {
  return (
    <section className="mt-9 break-inside-avoid">
      <h2 className="mb-3 border-b border-line pb-2 font-display text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function Resume() {
  const { profile, hero, about, resume, socialLinks } = useSite();
  const skills = useItems('skills', '/skills', { limit: 100 }).items;
  const exp = useItems('experience', '/experience', { limit: 50 }).items;
  const edu = useItems('education', '/education', { limit: 20 }).items;
  const certs = useItems('certifications', '/certifications', { limit: 30 }).items;
  const projects = useItems('projects-featured', '/projects', { limit: 3, sort: 'featured' }).items;
  const groups = skills.reduce((a, s) => ({ ...a, [s.category]: [...(a[s.category] || []), s.name] }), {});
  const contact = [profile.email, profile.phone, profile.location, ...socialLinks.filter((s) => s.url).map((s) => s.url.replace(/^https?:\/\//, ''))].filter(Boolean);

  return (
    <div className="container-x print-page max-w-3xl py-12">
      <SEO title="Resume" path="/resume" />
      <div className="no-print mb-8 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-muted">{resume.version && `Version ${resume.version}`}{resume.lastUpdated && ` · Updated ${fmtDate(resume.lastUpdated)}`}</p>
        <div className="flex gap-2">
          {resume.pdfUrl && <Button href={resume.pdfUrl} size="sm"><Download className="h-4 w-4" /> Download PDF</Button>}
          <Button variant="secondary" size="sm" onClick={() => window.print()}><Printer className="h-4 w-4" /> Print</Button>
        </div>
      </div>

      <header>
        <h1 className="font-display text-4xl font-extrabold">{profile.name}</h1>
        <p className="mt-1 text-lg text-accent">{hero.roleTitle || profile.title}</p>
        <p className="mt-3 text-sm text-muted">{contact.join('  ·  ')}</p>
      </header>

      <Block title="Summary"><p className="leading-relaxed">{resume.summary || about.bio}</p></Block>

      {Object.keys(groups).length > 0 && (
        <Block title="Skills">
          <dl className="space-y-1.5 text-sm">{Object.entries(groups).map(([c, names]) => <div key={c} className="grid grid-cols-[110px_1fr] gap-3"><dt className="font-medium">{c}</dt><dd className="text-muted">{names.join(', ')}</dd></div>)}</dl>
        </Block>
      )}

      {exp.length > 0 && (
        <Block title="Experience">
          <ul className="space-y-5">{exp.map((e) => (
            <li key={e._id}>
              <p className="font-semibold">{e.position} — {e.company}</p>
              <p className="text-xs text-muted">{fmtMonthYear(e.startDate)} – {e.current ? 'Present' : fmtMonthYear(e.endDate)}{e.location ? ` · ${e.location}` : ''}</p>
              {e.description && <p className="mt-1 text-sm">{e.description}</p>}
              {[...(e.responsibilities || []), ...(e.achievements || [])].length > 0 && <ul className="mt-1 list-disc pl-5 text-sm text-muted">{[...(e.responsibilities || []), ...(e.achievements || [])].map((r) => <li key={r}>{r}</li>)}</ul>}
            </li>
          ))}</ul>
        </Block>
      )}

      {projects.length > 0 && (
        <Block title="Selected projects">
          <ul className="space-y-3 text-sm">{projects.map((p) => <li key={p._id}><span className="font-semibold">{p.title}</span> <span className="text-muted">— {p.shortDescription} ({(p.technologies || []).slice(0, 5).join(', ')})</span></li>)}</ul>
        </Block>
      )}

      {edu.length > 0 && (
        <Block title="Education">
          <ul className="space-y-2 text-sm">{edu.map((e) => <li key={e._id}><span className="font-semibold">{e.degree}{e.subject ? `, ${e.subject}` : ''}</span> — {e.institution} <span className="text-muted">({[e.startYear, e.endYear].filter(Boolean).join('–')})</span></li>)}</ul>
        </Block>
      )}

      {certs.length > 0 && (
        <Block title="Certifications">
          <ul className="space-y-1.5 text-sm">{certs.map((c) => <li key={c._id}>{c.title} — <span className="text-muted">{c.organization}{c.issueDate ? `, ${fmtMonthYear(c.issueDate)}` : ''}</span></li>)}</ul>
        </Block>
      )}
    </div>
  );
}
