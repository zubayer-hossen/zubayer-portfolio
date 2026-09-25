import Section from './Section';
import Button from '../../components/ui/Button';
import { useSite } from '../../context/SiteContext';

export default function WorkWithMe() {
  const { settings } = useSite();
  const w = settings.workWithMe;
  if (!w) return null;
  return (
    <Section id="work-with-me">
      <div className="card grid gap-10 p-8 sm:p-12 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <h2 className="h-section">Work with me</h2>
          {w.status && <p className="mt-4 inline-flex items-center gap-2 text-sm text-muted"><span className="h-2 w-2 animate-pulseDot rounded-full bg-ok" aria-hidden="true" />{w.status}</p>}
          {w.text && <p className="lead mt-4">{w.text}</p>}
          <div className="mt-8"><Button to="/contact" magnetic>Start a project</Button></div>
        </div>
        <div className="space-y-6 text-sm">
          {w.responseTime && <div><p className="text-muted">Typical response time</p><p className="mt-1 font-display text-lg font-bold">{w.responseTime}</p></div>}
          {(w.projectTypes || []).length > 0 && (
            <div>
              <p className="text-muted">Projects I take on</p>
              <ul className="mt-2 flex flex-wrap gap-2">{w.projectTypes.map((p) => <li key={p} className="badge">{p}</li>)}</ul>
            </div>
          )}
        </div>
      </div>
    </Section>
  );
}
