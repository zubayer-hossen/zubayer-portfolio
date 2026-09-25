import { humanize, cn } from '../../lib/utils';

function Group({ title, children }) {
  return (
    <fieldset className="border-b border-line py-5 first:pt-0 last:border-0">
      <legend className="mb-3 font-display text-sm font-bold">{title}</legend>
      <div className="flex flex-wrap gap-1.5">{children}</div>
    </fieldset>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={cn('rounded-full border px-3 py-1 text-[13px] transition', active ? 'border-accent bg-accent text-accent-ink' : 'border-line text-muted hover:border-accent/60 hover:text-ink')}>
      {children}
    </button>
  );
}

export default function ProjectFilters({ facets, categoryNames, params, setParam, clear, hasFilters }) {
  const toggle = (key, value) => setParam(key, params[key] === value ? '' : value);
  return (
    <div>
      {facets.categories?.length > 0 && (
        <Group title="Category">
          {facets.categories.map((c) => <Chip key={c.slug} active={params.category === c.slug} onClick={() => toggle('category', c.slug)}>{categoryNames[c.slug] || humanize(c.slug)} ({c.count})</Chip>)}
        </Group>
      )}
      {facets.technologies?.length > 0 && (
        <Group title="Technology">
          {facets.technologies.slice(0, 14).map((t) => <Chip key={t.name} active={params.technology === t.name} onClick={() => toggle('technology', t.name)}>{t.name}</Chip>)}
        </Group>
      )}
      {facets.statuses?.length > 0 && (
        <Group title="Status">
          {facets.statuses.map((s) => <Chip key={s} active={params.status === s} onClick={() => toggle('status', s)}>{humanize(s)}</Chip>)}
        </Group>
      )}
      {facets.types?.length > 0 && (
        <Group title="Type">
          {facets.types.map((s) => <Chip key={s} active={params.type === s} onClick={() => toggle('type', s)}>{s}</Chip>)}
        </Group>
      )}
      <Group title="Show">
        <Chip active={params.featured === 'true'} onClick={() => toggle('featured', 'true')}>Featured only</Chip>
      </Group>
      {hasFilters && <button type="button" onClick={clear} className="mt-4 text-sm text-accent underline underline-offset-4">Clear all filters</button>}
    </div>
  );
}
