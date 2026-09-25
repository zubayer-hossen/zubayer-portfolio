import { useSite } from '../../context/SiteContext';
import Section from './Section';
import SectionHeading from '../../components/common/SectionHeading';
import { img } from '../../lib/api';
import { initials } from '../../lib/utils';
import Button from '../../components/ui/Button';

export default function AboutSection({ full = false }) {
  const { about, profile } = useSite();
  const blocks = [
    ['Career direction', about.careerDirection],
    ['How I work', about.philosophy],
    ['Learning now', about.currentLearning],
    ['Where I am heading', about.futureGoals],
  ].filter(([, v]) => v);

  return (
    <Section id="about">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="mx-auto w-full max-w-xs lg:mx-0">
          {profile.photo ? (
            <img src={img(profile.photo, 640)} alt={`Portrait of ${profile.name}`} loading="lazy" className="aspect-[4/5] w-full rounded-[28px] border border-line object-cover" />
          ) : (
            <div className="grid aspect-[4/5] w-full place-items-center rounded-[28px] border border-line bg-surface2" aria-hidden="true">
              <span className="font-display text-7xl font-extrabold text-accent/70">{initials(profile.name)}</span>
            </div>
          )}
        </div>
        <div>
          <SectionHeading title={about.headline || 'About me'} />
          <p className="text-lg leading-relaxed text-ink/90">{about.bio}</p>
          {(about.interests || []).length > 0 && (
            <ul className="mt-6 flex flex-wrap gap-2">{about.interests.map((i) => <li key={i} className="badge">{i}</li>)}</ul>
          )}
          {full ? (
            <dl className="mt-10 grid gap-4 sm:grid-cols-2">
              {blocks.map(([t, v]) => (
                <div key={t} className="card p-5">
                  <dt className="font-display font-bold">{t}</dt>
                  <dd className="mt-2 text-sm leading-relaxed text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="mt-8"><Button to="/about" variant="secondary">More about me</Button></div>
          )}
          {full && (about.timeline || []).length > 0 && (
            <ol className="mt-12 space-y-6 border-l border-line pl-6">
              {about.timeline.map((t, i) => (
                <li key={i} className="relative">
                  <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-accent" aria-hidden="true" />
                  <p className="font-mono text-xs text-muted">{t.year}</p>
                  <p className="font-display font-bold">{t.title}</p>
                  {t.description && <p className="mt-1 text-sm text-muted">{t.description}</p>}
                </li>
              ))}
            </ol>
          )}
        </div>
      </div>
    </Section>
  );
}
