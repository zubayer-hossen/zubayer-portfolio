import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useItems } from '../../hooks';
import Tabs from '../../components/ui/Tabs';
import Modal from '../../components/ui/Modal';
import { EmptyState, ErrorState } from '../../components/ui/States';
import { GridSkeleton } from '../../components/ui/Skeleton';
import TechIcon from '../../components/common/TechIcon';

function SkillDetail({ skill, onClose }) {
  const { items } = useItems('skill-projects', '/projects', { technology: skill?.name, limit: 6 }, { enabled: Boolean(skill) });
  return (
    <Modal open={Boolean(skill)} onClose={onClose} title={skill?.name || ''} size="md">
      {skill && (
        <div>
          <div className="flex items-center gap-4">
            <TechIcon name={skill.name} iconSlug={skill.iconSlug} iconUrl={skill.iconUrl} size={44} />
            <div>
              <p className="text-sm text-muted">{skill.category}</p>
              {skill.years != null && <p className="text-sm">{skill.years} {skill.years === 1 ? 'year' : 'years'} of experience</p>}
            </div>
          </div>
          {skill.description && <p className="mt-5 leading-relaxed text-muted">{skill.description}</p>}
          <div className="mt-5">
            <div className="mb-1.5 flex justify-between text-sm"><span>Proficiency</span><span className="text-muted">{skill.level}%</span></div>
            <div className="h-2 overflow-hidden rounded-full bg-surface2"><div className="h-full rounded-full bg-accent" style={{ width: `${skill.level}%` }} /></div>
          </div>
          <h3 className="mb-2 mt-6 font-display font-bold">Projects using {skill.name}</h3>
          {items.length ? (
            <ul className="space-y-1.5 text-sm">
              {items.map((p) => (
                <li key={p._id}><Link onClick={onClose} to={`/projects/${p.slug}`} className="link-underline">{p.title}</Link></li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted">No published project lists this technology yet.</p>
          )}
        </div>
      )}
    </Modal>
  );
}

export default function SkillsShowcase({ limit }) {
  const q = useItems('skills', '/skills', { limit: 100 });
  const [cat, setCat] = useState('all');
  const [selected, setSelected] = useState(null);

  const categories = useMemo(() => [...new Set(q.items.map((s) => s.category))], [q.items]);
  const list = useMemo(() => {
    let l = cat === 'all' ? q.items : q.items.filter((s) => s.category === cat);
    if (limit) l = [...l].sort((a, b) => Number(b.featured) - Number(a.featured)).slice(0, limit);
    return l;
  }, [q.items, cat, limit]);

  if (q.isLoading) return <GridSkeleton count={6} />;
  if (q.isError) return <ErrorState error={q.error} onRetry={q.refetch} />;
  if (!q.items.length) return <EmptyState title="No skills yet" text="Add skills from Admin → Skills." />;

  return (
    <div>
      {!limit && (
        <Tabs id="skill-tabs" className="mb-8 w-fit max-w-full" value={cat} onChange={setCat} tabs={[{ id: 'all', label: 'All', count: q.items.length }, ...categories.map((c) => ({ id: c, label: c, count: q.items.filter((s) => s.category === c).length }))]} />
      )}
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {list.map((s) => (
          <li key={s._id}>
            <button type="button" onClick={() => setSelected(s)} className="card card-hover group w-full p-5 text-left">
              <div className="flex items-center gap-3.5">
                <TechIcon name={s.name} iconSlug={s.iconSlug} iconUrl={s.iconUrl} size={32} />
                <div className="min-w-0 flex-1">
                  <p className="truncate font-display font-bold">{s.name}</p>
                  <p className="text-xs text-muted">{s.category}{s.years != null ? ` · ${s.years} yr` : ''}</p>
                </div>
                <span className="font-mono text-xs text-muted">{s.level}%</span>
              </div>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-surface2" role="progressbar" aria-valuenow={s.level} aria-valuemin={0} aria-valuemax={100} aria-label={`${s.name} proficiency`}>
                <motion.div className="h-full rounded-full bg-accent" initial={{ width: 0 }} whileInView={{ width: `${s.level}%` }} viewport={{ once: true }} transition={{ duration: 0.9, ease: 'easeOut' }} />
              </div>
              {s.description && <p className="mt-3 line-clamp-2 text-sm text-muted">{s.description}</p>}
            </button>
          </li>
        ))}
      </ul>
      <SkillDetail skill={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
