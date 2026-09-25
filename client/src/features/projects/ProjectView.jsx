import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Eye, ExternalLink, GitFork, Github, Heart, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, errorMessage, img } from '../../lib/api';
import { compact, fmtDate, humanize, parseVideo } from '../../lib/utils';
import { useT } from '../../i18n';
import Button from '../../components/ui/Button';
import Alert from '../../components/ui/Alert';
import Markdown from '../../components/common/Markdown';
import Lightbox from '../../components/common/Lightbox';
import CoverArt from '../../components/common/CoverArt';
import ShareButtons from '../../components/common/ShareButtons';
import ProjectCard from '../../components/common/ProjectCard';
import { cn } from '../../lib/utils';

const CASE_STEPS = [
  ['research', 'Research'], ['planning', 'Planning'], ['design', 'Design'], ['development', 'Development'],
  ['challenges', 'Challenges'], ['solutions', 'Solutions'], ['result', 'Result'], ['lessons', 'Lessons learned'], ['futurePlan', 'What is next'],
];

function Block({ title, children }) {
  if (!children) return null;
  return (
    <section className="mt-12">
      <h2 className="mb-3 font-display text-2xl font-bold">{title}</h2>
      {children}
    </section>
  );
}

export default function ProjectView({ project: p, preview = false }) {
  const { t } = useT();
  const [liked, setLiked] = useState(Boolean(p.liked));
  const [likes, setLikes] = useState(p.likes || 0);
  const [lightbox, setLightbox] = useState(null);
  const video = parseVideo(p.videoUrl);
  const shots = (p.screenshots || []).filter(Boolean);
  const gallery = [p.cover, ...shots].filter(Boolean);
  const cs = p.caseStudy || {};
  const steps = CASE_STEPS.filter(([k]) => cs[k]);

  const like = async () => {
    if (preview) return;
    try {
      const { data } = await api.post(`/projects/${p.slug}/like`);
      setLiked(data.data.liked);
      setLikes(data.data.likes);
    } catch (e) {
      toast.error(errorMessage(e));
    }
  };
  const click = (kind) => !preview && api.post(`/projects/${p.slug}/click`, { kind }).catch(() => {});
  const meta = p.githubMeta || {};

  return (
    <article className="container-x pb-10 pt-10 sm:pt-14">
      {preview && <Alert type="warning" title="Preview" className="mb-8">This is how the project will look. Visitors cannot see it until it is published.</Alert>}
      <Link to="/projects" className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-ink"><ArrowLeft className="h-4 w-4" /> All projects</Link>

      <header className="max-w-3xl">
        <div className="mb-4 flex flex-wrap gap-2">
          {p.featured && <span className="badge badge-accent">{t('featured')}</span>}
          {p.isPlaceholder && <span className="badge badge-warn">Placeholder</span>}
          {p.status && <span className="badge">{humanize(p.status)}</span>}
          {p.category && <span className="badge">{humanize(p.category)}</span>}
        </div>
        <h1 className="h-display">{p.title}</h1>
        {p.shortDescription && <p className="lead mt-5">{p.shortDescription}</p>}
        <div className="mt-7 flex flex-wrap items-center gap-3">
          {p.liveUrl && <Button href={p.liveUrl} onClick={() => click('demo')}><ExternalLink className="h-4 w-4" /> {t('liveDemo')}</Button>}
          {p.githubUrl && <Button href={p.githubUrl} variant="secondary" onClick={() => click('github')}><Github className="h-4 w-4" /> {t('sourceCode')}</Button>}
          <button type="button" onClick={like} aria-pressed={liked} className={cn('btn btn-secondary', liked && 'border-danger/60 text-danger')}>
            <Heart className={cn('h-4 w-4', liked && 'fill-current')} /> {compact(likes)}
          </button>
        </div>
      </header>

      <div className="mt-10 overflow-hidden rounded-3xl border border-line bg-surface2">
        {video ? (
          video.type === 'embed' ? (
            <iframe title={`${p.title} video`} src={video.src} className="aspect-video w-full" allow="accelerometer; encrypted-media; picture-in-picture" allowFullScreen loading="lazy" />
          ) : (
            <video src={video.src} controls preload="metadata" poster={p.cover ? img(p.cover, 1200) : undefined} className="aspect-video w-full bg-black" />
          )
        ) : p.cover ? (
          <button type="button" onClick={() => setLightbox(0)} className="block w-full" aria-label="Open image">
            <img src={img(p.cover, 1400)} alt={`${p.title} preview`} className="aspect-[16/9] w-full object-cover" />
          </button>
        ) : (
          <CoverArt title={p.title} className="aspect-[16/9] w-full" />
        )}
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-[1fr_300px]">
        <div className="min-w-0">
          <section>
            <h2 className="mb-3 font-display text-2xl font-bold">Overview</h2>
            <Markdown>{p.description}</Markdown>
          </section>

          {p.features?.length > 0 && (
            <Block title="Key features">
              <ul className="grid gap-2 sm:grid-cols-2">{p.features.map((f) => <li key={f} className="card flex gap-2.5 p-3.5 text-sm"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" aria-hidden="true" />{f}</li>)}</ul>
            </Block>
          )}
          {p.problem && <Block title="The problem"><Markdown>{p.problem}</Markdown></Block>}
          {p.solution && <Block title="The solution"><Markdown>{p.solution}</Markdown></Block>}
          {p.process && <Block title="How I built it"><Markdown>{p.process}</Markdown></Block>}
          {p.architecture && <Block title="Architecture"><Markdown>{p.architecture}</Markdown></Block>}
          {p.challenges?.length > 0 && <Block title="Challenges"><ul className="list-disc space-y-2 pl-5 text-ink/90">{p.challenges.map((c) => <li key={c}>{c}</li>)}</ul></Block>}
          {p.results && <Block title="Results"><Markdown>{p.results}</Markdown></Block>}
          {p.futureImprovements && <Block title="Future improvements"><Markdown>{p.futureImprovements}</Markdown></Block>}

          {gallery.length > 0 && (
            <Block title="Gallery">
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {gallery.map((src, i) => (
                  <li key={src + i}>
                    <button type="button" onClick={() => setLightbox(i)} className="block w-full overflow-hidden rounded-xl border border-line" aria-label={`Open image ${i + 1}`}>
                      <img src={img(src, 500)} alt="" loading="lazy" className="aspect-[4/3] w-full object-cover transition duration-300 hover:scale-105" />
                    </button>
                  </li>
                ))}
              </ul>
            </Block>
          )}

          {cs.enabled && steps.length > 0 && (
            <section id="case-study" className="mt-16 scroll-mt-28 rounded-3xl border border-line bg-surface/60 p-6 sm:p-10">
              <h2 className="font-display text-3xl font-bold">Case study</h2>
              <ol className="mt-8 space-y-8 border-l border-line pl-7">
                {steps.map(([k, label], i) => (
                  <li key={k} className="relative">
                    <span className="absolute -left-[41px] grid h-7 w-7 place-items-center rounded-full border border-line bg-bg font-mono text-xs text-muted">{i + 1}</span>
                    <h3 className="font-display text-lg font-bold">{label}</h3>
                    <Markdown className="!my-0">{cs[k]}</Markdown>
                  </li>
                ))}
              </ol>
            </section>
          )}
        </div>

        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="card space-y-5 p-5 text-sm">
            <dl className="space-y-3">
              {p.projectDate && <div className="flex justify-between gap-4"><dt className="text-muted">Date</dt><dd>{fmtDate(p.projectDate, { year: 'numeric', month: 'short' })}</dd></div>}
              {p.type && <div className="flex justify-between gap-4"><dt className="text-muted">Type</dt><dd>{p.type}</dd></div>}
              <div className="flex justify-between gap-4"><dt className="text-muted">{humanize(t('views'))}</dt><dd className="inline-flex items-center gap-1"><Eye className="h-3.5 w-3.5" />{compact(p.views)}</dd></div>
            </dl>
            {(meta.stars != null || meta.commits != null) && (
              <dl className="grid grid-cols-3 gap-2 border-t border-line pt-4 text-center">
                <div><dd className="inline-flex items-center gap-1 font-bold"><Star className="h-3.5 w-3.5" />{meta.stars ?? 0}</dd><dt className="text-xs text-muted">Stars</dt></div>
                <div><dd className="inline-flex items-center gap-1 font-bold"><GitFork className="h-3.5 w-3.5" />{meta.forks ?? 0}</dd><dt className="text-xs text-muted">Forks</dt></div>
                <div><dd className="font-bold">{meta.commits ?? '—'}</dd><dt className="text-xs text-muted">Commits</dt></div>
              </dl>
            )}
            {p.technologies?.length > 0 && (
              <div className="border-t border-line pt-4">
                <p className="mb-2 text-muted">Built with</p>
                <ul className="flex flex-wrap gap-1.5">{p.technologies.map((x) => <li key={x} className="badge">{x}</li>)}</ul>
              </div>
            )}
            {!preview && (
              <div className="border-t border-line pt-4">
                <p className="mb-2 text-muted">{t('share')}</p>
                <ShareButtons title={p.title} type="project" slug={p.slug} path={`/projects/${p.slug}`} />
              </div>
            )}
          </div>
        </aside>
      </div>

      {p.related?.length > 0 && (
        <section className="mt-20">
          <h2 className="mb-6 font-display text-2xl font-bold">More projects</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{p.related.map((r) => <ProjectCard key={r._id} project={r} />)}</div>
        </section>
      )}

      {lightbox != null && gallery.length > 0 && <Lightbox images={gallery.map((g) => img(g, 1800))} index={lightbox} onClose={() => setLightbox(null)} onChange={setLightbox} />}
    </article>
  );
}
