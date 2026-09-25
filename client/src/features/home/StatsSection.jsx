import { useSite } from '../../context/SiteContext';
import Counter from '../../components/effects/Counter';

export default function StatsSection() {
  const { settings, counts } = useSite();
  const stats = (settings.stats || [])
    .map((s) => ({ ...s, shown: s.auto ? counts[s.auto] ?? 0 : Number(s.value) || 0 }))
    .filter((s) => s.shown > 0);
  if (!stats.length) return null;
  return (
    <section aria-label="Quick stats" className="border-y border-line bg-surface/40">
      <dl className="container-x grid grid-cols-2 divide-x divide-line md:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="px-4 py-8 text-center first:border-l-0">
            <dd className="font-display text-4xl font-extrabold"><Counter value={s.shown} suffix={s.suffix} /></dd>
            <dt className="mt-1 text-sm text-muted">{s.label}</dt>
          </div>
        ))}
      </dl>
    </section>
  );
}
