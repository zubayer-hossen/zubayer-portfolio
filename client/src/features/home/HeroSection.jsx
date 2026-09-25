import { Link } from 'react-router-dom';
import { motion, useMotionValue, useReducedMotion, useSpring, useTransform } from 'framer-motion';
import { useSite } from '../../context/SiteContext';
import Button from '../../components/ui/Button';
import SocialLinks from '../../components/common/SocialLinks';
import { img } from '../../lib/api';
import { initials } from '../../lib/utils';

const SPOTS = [
  { x: '-6%', y: '8%', d: 26 },
  { x: '78%', y: '-4%', d: 40 },
  { x: '92%', y: '30%', d: 18 },
  { x: '-10%', y: '44%', d: 34 },
  { x: '86%', y: '64%', d: 30 },
  { x: '4%', y: '84%', d: 22 },
  { x: '60%', y: '96%', d: 38 },
  { x: '32%', y: '-8%', d: 16 },
];

function Chip({ label, spot, mx, my, index, reduce }) {
  const x = useSpring(useTransform(mx, [-0.5, 0.5], [-spot.d, spot.d]), { stiffness: 90, damping: 14 });
  const y = useSpring(useTransform(my, [-0.5, 0.5], [-spot.d, spot.d]), { stiffness: 90, damping: 14 });
  return (
    <motion.span
      aria-hidden="true"
      className="glass absolute rounded-full px-3 py-1.5 font-mono text-xs text-ink/90 shadow-lift"
      style={{ left: spot.x, top: spot.y, x: reduce ? 0 : x, y: reduce ? 0 : y }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.5 + index * 0.07, duration: 0.4 }}
    >
      {label}
    </motion.span>
  );
}

export default function HeroSection() {
  const { hero, profile, resume, socialLinks } = useSite();
  const reduce = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotateY = useSpring(useTransform(mx, [-0.5, 0.5], [-9, 9]), { stiffness: 110, damping: 16 });
  const rotateX = useSpring(useTransform(my, [-0.5, 0.5], [7, -7]), { stiffness: 110, damping: 16 });

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    mx.set(0);
    my.set(0);
  };

  const name = hero.headline || profile.name;
  const tech = (hero.floatingTech || []).slice(0, SPOTS.length);
  const stack = tech.slice(0, 4);
  const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] } } };

  const ctaProps = (c) => {
    if (c.path === '@resume') return resume.pdfUrl ? { href: resume.pdfUrl } : { to: '/resume' };
    return /^https?:/.test(c.path) ? { href: c.path } : { to: c.path };
  };

  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-title">
      <div className="dot-grid pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="container-x relative grid items-center gap-16 pb-24 pt-14 sm:pt-20 lg:grid-cols-[1.1fr_0.9fr] lg:pb-32 lg:pt-28">
        <motion.div initial={reduce ? false : 'hidden'} animate="show" transition={{ staggerChildren: 0.09 }}>
          {hero.availabilityStatus && (
            <motion.p variants={item} className="mb-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/70 px-3.5 py-1.5 text-sm text-muted">
              <span className="h-2 w-2 animate-pulseDot rounded-full bg-ok" aria-hidden="true" />
              {hero.availabilityText}
            </motion.p>
          )}
          <motion.p variants={item} className="mb-2 text-lg text-muted">{hero.greeting}</motion.p>
          <motion.h1 variants={item} id="hero-title" className="font-display text-5xl font-extrabold leading-[1.02] sm:text-6xl lg:text-7xl">
            {name}
          </motion.h1>
          <motion.p variants={item} className="mt-4 font-display text-2xl font-semibold text-accent sm:text-3xl">{hero.roleTitle}</motion.p>
          <motion.p variants={item} className="mt-5 max-w-xl text-lg text-ink/90">{hero.subtitle}</motion.p>
          <motion.p variants={item} className="lead mt-3 max-w-xl text-base">{hero.description}</motion.p>
          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            {(hero.ctas || []).map((c, i) => (
              <Button key={`${c.label}-${i}`} variant={c.variant || 'secondary'} magnetic={i === 0} {...ctaProps(c)}>{c.label}</Button>
            ))}
          </motion.div>
          <motion.div variants={item} className="mt-8"><SocialLinks links={socialLinks} /></motion.div>
        </motion.div>

        <div className="relative mx-auto w-full max-w-md" onMouseMove={onMove} onMouseLeave={onLeave} style={{ perspective: 1100 }}>
          {tech.map((t, i) => <Chip key={t} label={t} spot={SPOTS[i]} mx={mx} my={my} index={i} reduce={reduce} />)}
          <motion.div
            style={{ rotateX: reduce ? 0 : rotateX, rotateY: reduce ? 0 : rotateY, transformStyle: 'preserve-3d' }}
            initial={reduce ? false : { opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="glass relative rounded-[28px] p-6 shadow-lift"
          >
            <div className="flex items-center gap-4">
              {profile.photo ? (
                <img src={img(profile.photo, 200)} alt={`Portrait of ${profile.name}`} className="h-16 w-16 rounded-2xl object-cover" />
              ) : (
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-accent font-display text-xl font-extrabold text-accent-ink" aria-hidden="true">{initials(profile.name)}</span>
              )}
              <div>
                <p className="font-display text-lg font-bold leading-tight">{profile.name}</p>
                <p className="text-sm text-muted">{profile.location}</p>
              </div>
            </div>
            <pre className="mt-6 overflow-x-auto rounded-2xl border border-line bg-bg/70 p-4 font-mono text-[12.5px] leading-6" aria-label="Summary of skills as code">
              <code>
                <span className="text-accent">const</span> developer = {'{'}{'\n'}
                {'  '}role: <span className="text-ok">'{hero.roleTitle}'</span>,{'\n'}
                {'  '}stack: [{stack.map((s, i) => <span key={s}><span className="text-ok">'{s}'</span>{i < stack.length - 1 ? ', ' : ''}</span>)}],{'\n'}
                {'  '}openToWork: <span className="text-accent">{String(Boolean(hero.availabilityStatus))}</span>,{'\n'}
                {'}'};
              </code>
            </pre>
            <Link to="/contact" className="mt-5 inline-flex text-sm text-muted transition hover:text-ink">Start a conversation</Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
