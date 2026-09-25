import { useRef, useState } from 'react';
import { Controller } from 'react-hook-form';
import { ArrowDown, ArrowUp, ImagePlus, Library, Loader2, Plus, Trash2, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { api, errorMessage } from '../../lib/api';
import { cn, getPath, setPath } from '../../lib/utils';
import { useApi } from '../../hooks';
import Markdown from '../../components/common/Markdown';
import Button from '../../components/ui/Button';
import MediaPicker from './MediaPicker';

export async function uploadFiles(files, folder = 'general') {
  const fd = new FormData();
  fd.append('folder', folder);
  [...files].forEach((f) => fd.append('files', f));
  const { data } = await api.post('/admin/media', fd);
  return data.data;
}

const defaultFor = (f) => {
  if (f.default !== undefined) return f.default;
  if (['tags', 'lines', 'objectList'].includes(f.type) || f.multiple) return [];
  if (f.type === 'boolean') return false;
  return '';
};

/** Merge server data over sensible defaults so every input is controlled. */
export function buildDefaults(fields, data = {}) {
  let out = { ...data };
  for (const f of fields) {
    const cur = getPath(data, f.name);
    out = setPath(out, f.name, cur === undefined || cur === null ? defaultFor(f) : cur);
  }
  return out;
}

/** Normalise form values before sending them to the API. */
export function cleanValues(fields, values) {
  let out = values;
  for (const f of fields) {
    let v = getPath(values, f.name);
    if (f.type === 'lines') v = (v || []).map((s) => String(s).trim()).filter(Boolean);
    else if (f.type === 'number') v = v === '' || v == null ? null : Number(v);
    else if (f.type === 'password' && !v) v = undefined;
    else if (f.type === 'objectList') {
      const nums = f.fields.filter((s) => s.type === 'number').map((s) => s.name);
      v = (v || []).map((row) => ({ ...row, ...Object.fromEntries(nums.map((n) => [n, row[n] === '' || row[n] == null ? 0 : Number(row[n])])) }));
    }
    out = setPath(out, f.name, v);
  }
  return out;
}

const toLocalInput = (v) => {
  if (!v) return '';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return '';
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

function TagsInput({ value = [], onChange, placeholder }) {
  const [draft, setDraft] = useState('');
  const add = (raw) => {
    const parts = raw.split(',').map((s) => s.trim()).filter(Boolean);
    if (parts.length) onChange([...new Set([...value, ...parts])]);
    setDraft('');
  };
  return (
    <div className="input flex flex-wrap items-center gap-1.5 !p-2">
      {value.map((t) => (
        <span key={t} className="badge badge-accent gap-1">
          {t}
          <button type="button" aria-label={`Remove ${t}`} onClick={() => onChange(value.filter((x) => x !== t))}><X className="h-3 w-3" /></button>
        </span>
      ))}
      <input
        value={draft}
        placeholder={value.length ? '' : placeholder || 'Type and press Enter'}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault();
            add(draft);
          } else if (e.key === 'Backspace' && !draft && value.length) onChange(value.slice(0, -1));
        }}
        onBlur={() => draft && add(draft)}
        className="min-w-32 flex-1 bg-transparent px-1.5 py-1 text-sm outline-none"
      />
    </div>
  );
}

function SelectInput({ field, value, onChange }) {
  const from = field.optionsFrom;
  const q = useApi(`admin-opt-${from?.endpoint}`, from?.endpoint, { limit: 100 }, { enabled: Boolean(from), staleTime: 30_000 });
  const options = from
    ? (q.data?.items || []).map((i) => ({ value: i[from.value], label: i[from.label] }))
    : (field.options || []).map((o) => (typeof o === 'string' ? { value: o, label: o === '' ? '— none —' : o.replace(/[-_]/g, ' ') } : o));
  return (
    <select className="input" value={value ?? ''} onChange={(e) => onChange(e.target.value)}>
      {!options.some((o) => o.value === '') && <option value="">— choose —</option>}
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      {value && !options.some((o) => o.value === value) && <option value={value}>{value}</option>}
    </select>
  );
}

function MediaInput({ field, value, onChange }) {
  const multiple = Boolean(field.multiple);
  const list = multiple ? value || [] : value ? [value] : [];
  const fileRef = useRef(null);
  const [busy, setBusy] = useState(false);
  const [pick, setPick] = useState(false);
  const isFile = field.type === 'file';

  const add = (urls) => onChange(multiple ? [...list, ...urls] : urls[0]);
  const upload = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const media = await uploadFiles(multiple ? files : [files[0]], field.folder);
      add(media.map((m) => m.url));
      toast.success('Uploaded');
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };

  return (
    <div>
      {list.length > 0 && (
        <ul className="mb-3 flex flex-wrap gap-3">
          {list.map((u, i) => (
            <li key={u + i} className="relative">
              {/\.(png|jpe?g|webp|gif|avif)(\?|$)/i.test(u) || u.includes('/image/upload/') ? (
                <img src={u} alt="" className="h-20 w-20 rounded-xl border border-line object-cover" />
              ) : (
                <a href={u} target="_blank" rel="noopener noreferrer" className="grid h-20 w-28 place-items-center rounded-xl border border-line bg-surface2 px-2 text-center text-xs text-muted">Open file</a>
              )}
              <button type="button" aria-label="Remove" onClick={() => onChange(multiple ? list.filter((_, x) => x !== i) : '')} className="absolute -right-2 -top-2 grid h-6 w-6 place-items-center rounded-full border border-line bg-surface text-danger"><X className="h-3.5 w-3.5" /></button>
            </li>
          ))}
        </ul>
      )}
      <div className="flex flex-wrap gap-2">
        <input ref={fileRef} type="file" hidden multiple={multiple} accept={isFile ? 'application/pdf,image/*' : 'image/*'} onChange={(e) => upload(e.target.files)} />
        <Button variant="secondary" size="sm" loading={busy} onClick={() => fileRef.current?.click()}><ImagePlus className="h-4 w-4" /> Upload</Button>
        <Button variant="secondary" size="sm" onClick={() => setPick(true)}><Library className="h-4 w-4" /> Library</Button>
      </div>
      {!multiple && <input className="input mt-2" value={value || ''} placeholder="…or paste a URL" onChange={(e) => onChange(e.target.value)} />}
      <MediaPicker open={pick} onClose={() => setPick(false)} accept={isFile ? 'any' : 'image'} onPick={(m) => add([m.url])} />
    </div>
  );
}

function MarkdownInput({ field, value, onChange }) {
  const [tab, setTab] = useState('write');
  const [busy, setBusy] = useState(false);
  const fileRef = useRef(null);
  const insertImage = async (files) => {
    if (!files?.length) return;
    setBusy(true);
    try {
      const [m] = await uploadFiles([files[0]], 'blog');
      onChange(`${value || ''}\n\n![${m.originalName || 'image'}](${m.url})\n`);
    } catch (e) {
      toast.error(errorMessage(e));
    } finally {
      setBusy(false);
      if (fileRef.current) fileRef.current.value = '';
    }
  };
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <div className="flex gap-1 rounded-lg border border-line p-0.5 text-sm">
          {['write', 'preview'].map((t) => <button key={t} type="button" onClick={() => setTab(t)} className={cn('rounded-md px-3 py-1 capitalize', tab === t ? 'bg-accent text-accent-ink' : 'text-muted')}>{t}</button>)}
        </div>
        <input ref={fileRef} type="file" hidden accept="image/*" onChange={(e) => insertImage(e.target.files)} />
        <Button variant="ghost" size="sm" loading={busy} onClick={() => fileRef.current?.click()}><ImagePlus className="h-4 w-4" /> Insert image</Button>
      </div>
      {tab === 'write' ? (
        <textarea value={value ?? ''} onChange={(e) => onChange(e.target.value)} rows={field.rows || 16} className="input resize-y font-mono text-[13px] leading-6" placeholder="Write in Markdown…" />
      ) : (
        <div className="min-h-40 rounded-xl border border-line p-5">{value?.trim() ? <Markdown>{value}</Markdown> : <p className="text-sm text-muted">Nothing to preview yet.</p>}</div>
      )}
    </div>
  );
}

function ObjectList({ field, value = [], onChange }) {
  const set = (i, key, v) => onChange(value.map((row, x) => (x === i ? { ...row, [key]: v } : row)));
  const move = (i, d) => {
    const j = i + d;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const blank = Object.fromEntries(field.fields.map((f) => [f.name, f.type === 'boolean' ? false : '']));
  const iconBtn = 'grid h-8 w-8 place-items-center rounded-lg text-muted hover:bg-surface2 hover:text-ink disabled:opacity-30';
  return (
    <div className="space-y-3">
      {value.map((row, i) => (
        <div key={i} className="rounded-2xl border border-line bg-surface2/40 p-4">
          <div className="mb-3 flex items-center justify-between">
            <span className="text-sm font-medium">{field.itemLabel || 'Item'} {i + 1}</span>
            <span className="flex">
              <button type="button" className={iconBtn} disabled={i === 0} onClick={() => move(i, -1)} aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
              <button type="button" className={iconBtn} disabled={i === value.length - 1} onClick={() => move(i, 1)} aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
              <button type="button" className={cn(iconBtn, 'hover:text-danger')} onClick={() => onChange(value.filter((_, x) => x !== i))} aria-label="Remove"><Trash2 className="h-4 w-4" /></button>
            </span>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {field.fields.map((sub) => (
              <div key={sub.name} className={sub.type === 'textarea' ? 'sm:col-span-2' : ''}>
                <label className="label">{sub.label}</label>
                <FieldInput field={sub} value={row[sub.name]} onChange={(v) => set(i, sub.name, v)} />
              </div>
            ))}
          </div>
        </div>
      ))}
      <Button variant="secondary" size="sm" onClick={() => onChange([...value, { ...blank }])}><Plus className="h-4 w-4" /> Add {(field.itemLabel || 'item').toLowerCase()}</Button>
    </div>
  );
}

export function FieldInput({ field, value, onChange, invalid, id }) {
  const cls = cn('input', invalid && 'input-error');
  switch (field.type) {
    case 'textarea':
      return <textarea id={id} rows={field.rows || 4} className={cn(cls, 'resize-y')} value={value ?? ''} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
    case 'markdown':
      return <MarkdownInput field={field} value={value} onChange={onChange} />;
    case 'number':
      return <input id={id} type="number" className={cls} value={value ?? ''} min={field.min} max={field.max} step={field.step} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />;
    case 'boolean':
      return (
        <button type="button" role="switch" id={id} aria-checked={Boolean(value)} onClick={() => onChange(!value)} className={cn('relative h-6 w-11 rounded-full border transition', value ? 'border-accent bg-accent' : 'border-line bg-surface2')}>
          <span className={cn('absolute top-0.5 h-4.5 w-4.5 rounded-full bg-white shadow transition-all', value ? 'left-[22px]' : 'left-0.5')} style={{ width: 18, height: 18 }} />
        </button>
      );
    case 'select':
      return <SelectInput field={field} value={value} onChange={onChange} />;
    case 'date':
      return <input id={id} type="date" className={cls} value={value ? String(value).slice(0, 10) : ''} onChange={(e) => onChange(e.target.value)} />;
    case 'datetime':
      return <input id={id} type="datetime-local" className={cls} value={toLocalInput(value)} onChange={(e) => onChange(e.target.value ? new Date(e.target.value).toISOString() : '')} />;
    case 'tags':
      return <TagsInput value={value || []} onChange={onChange} placeholder={field.placeholder} />;
    case 'lines':
      return <textarea id={id} rows={field.rows || 4} className={cn(cls, 'resize-y')} value={(value || []).join('\n')} placeholder="One per line" onChange={(e) => onChange(e.target.value.split('\n'))} />;
    case 'image':
    case 'file':
      return <MediaInput field={field} value={value} onChange={onChange} />;
    case 'objectList':
      return <ObjectList field={field} value={value || []} onChange={onChange} />;
    default:
      return <input id={id} type={field.type === 'password' ? 'password' : field.type === 'email' ? 'email' : field.type === 'url' ? 'url' : 'text'} autoComplete={field.type === 'password' ? 'new-password' : 'off'} className={cls} value={value ?? ''} placeholder={field.placeholder} onChange={(e) => onChange(e.target.value)} />;
  }
}

export function FormField({ field, control, error }) {
  const id = `f-${field.name}`;
  const inline = field.type === 'boolean';
  return (
    <div className={cn(inline && 'flex items-center justify-between gap-4 rounded-xl border border-line px-4 py-3', ['markdown', 'objectList', 'textarea', 'lines'].includes(field.type) && 'sm:col-span-2')}>
      <div className={inline ? 'min-w-0' : undefined}>
        <label htmlFor={id} className={cn('label', inline && '!mb-0')}>{field.label}{field.required && <span className="text-danger"> *</span>}</label>
        {field.hint && inline && <p className="hint">{field.hint}</p>}
      </div>
      <div className={inline ? undefined : ''}>
        <Controller
          name={field.name}
          control={control}
          rules={field.required ? { required: `${field.label} is required` } : undefined}
          render={({ field: f }) => <FieldInput id={id} field={field} value={f.value} onChange={f.onChange} invalid={Boolean(error)} />}
        />
        {field.hint && !inline && <p className="hint">{field.hint}</p>}
        {error && <p className="field-error" role="alert">{error}</p>}
      </div>
    </div>
  );
}
