import slugify from 'slugify';

export function makeSlug(text) {
  return slugify(String(text || ''), { lower: true, strict: true, trim: true });
}

/** Adds a unique `slug` field, auto-generated from `source` when empty. */
export default function slugPlugin(schema, { source = 'title' } = {}) {
  schema.add({ slug: { type: String, unique: true, trim: true, lowercase: true } });
  schema.pre('validate', async function (next) {
    try {
      let base = makeSlug(this.slug || this[source]);
      if (!base) base = `item-${Date.now().toString(36)}`;
      let slug = base;
      let i = 2;
      while (await this.constructor.exists({ slug, _id: { $ne: this._id } })) slug = `${base}-${i++}`;
      this.slug = slug;
      next();
    } catch (e) {
      next(e);
    }
  });
}
