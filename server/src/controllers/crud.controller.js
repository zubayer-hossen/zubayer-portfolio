import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { logActivity } from '../services/activityLog.service.js';

export const ok = (res, data, status = 200) => res.status(status).json({ success: true, data });

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const castVal = (v) => (v === 'true' ? true : v === 'false' ? false : v);
const BASE_SORT = ['createdAt', 'updatedAt', 'order', 'title', 'name', 'views', 'likes', 'publishedAt', 'level', 'startDate', 'endYear', 'issueDate', 'status'];
const STRIP = ['_id', '__v', 'createdAt', 'updatedAt'];

/** Builds filter / sort / pagination from the query string using allow-lists only. */
export function listQuery(req, { searchFields = [], filterFields = [], sortable = [], defaultSort = '-createdAt', base = {} }) {
  const { q, page, limit, sort } = req.query;
  const and = [];
  if (Object.keys(base).length) and.push(base);

  for (const f of filterFields) {
    const v = req.query[f];
    if (typeof v === 'string' && v !== '') and.push({ [f]: castVal(v) });
  }
  if (typeof q === 'string' && q.trim() && searchFields.length) {
    const rx = new RegExp(esc(q.trim().slice(0, 80)), 'i');
    and.push({ $or: searchFields.map((f) => ({ [f]: rx })) });
  }

  const allowed = new Set([...BASE_SORT, ...sortable]);
  const wanted = typeof sort === 'string' ? sort : defaultSort;
  const parts = wanted.split(',').filter((p) => allowed.has(p.replace(/^-/, '')));
  const chosen = parts.length ? parts : defaultSort.split(',');
  const sortSpec = Object.fromEntries(chosen.map((p) => (p.startsWith('-') ? [p.slice(1), -1] : [p, 1])));

  const p = Math.max(1, parseInt(page, 10) || 1);
  const l = Math.min(100, Math.max(1, parseInt(limit, 10) || 12));
  return { filter: and.length ? { $and: and } : {}, page: p, limit: l, sort: sortSpec, skip: (p - 1) * l };
}

export async function paginate(Model, req, opts, { select } = {}) {
  const { filter, page, limit, sort, skip } = listQuery(req, opts);
  let query = Model.find(filter).sort(sort).skip(skip).limit(limit);
  if (select) query = query.select(select);
  const [items, total] = await Promise.all([query.lean(), Model.countDocuments(filter)]);
  return { items, pagination: { page, limit, total, pages: Math.max(1, Math.ceil(total / limit)) } };
}

/**
 * Generic CRUD handler factory used by most content collections.
 * Keeps controllers tiny and behaviour (validation, activity log, role guards) consistent.
 */
export function crud(Model, o = {}) {
  const {
    entity = Model.modelName,
    searchFields = [],
    filterFields = [],
    sortable = [],
    defaultSort = '-createdAt',
    publicFilter = () => ({}),
    protectedFields = [],
    updatableFields,
    statusGuard, // { field, blocked: [...], fallback } -> editors cannot publish
    select,
    adminSelect,
    beforeSave,
    beforeDelete,
    label = (d) => d.title || d.name || d.clientName || d.company || d.institution || d.text || d.platform || String(d._id),
  } = o;

  const listOpts = { searchFields, filterFields, sortable, defaultSort };

  const clean = (req, existing) => {
    let body = { ...req.body };
    STRIP.forEach((k) => delete body[k]);
    protectedFields.forEach((k) => delete body[k]);
    if (existing && updatableFields) body = Object.fromEntries(Object.entries(body).filter(([k]) => updatableFields.includes(k)));
    if (statusGuard && req.user?.role === 'editor' && statusGuard.blocked.includes(body[statusGuard.field])) {
      body[statusGuard.field] = existing ? existing[statusGuard.field] : statusGuard.fallback;
    }
    return body;
  };

  const publicList = asyncHandler(async (req, res) =>
    ok(res, await paginate(Model, req, { ...listOpts, base: publicFilter(req) }, { select }))
  );

  const publicGet = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const cond = mongoose.isValidObjectId(id) ? { _id: id } : Model.schema.path('slug') ? { slug: id } : null;
    if (!cond) throw new ApiError(404, `${entity} not found`);
    let q = Model.findOne({ $and: [cond, publicFilter(req)] });
    if (select) q = q.select(select);
    const doc = await q.lean();
    if (!doc) throw new ApiError(404, `${entity} not found`);
    ok(res, doc);
  });

  const adminList = asyncHandler(async (req, res) => ok(res, await paginate(Model, req, listOpts, { select: adminSelect })));

  const adminGet = asyncHandler(async (req, res) => {
    let q = Model.findById(req.params.id);
    if (adminSelect) q = q.select(adminSelect);
    const doc = await q;
    if (!doc) throw new ApiError(404, `${entity} not found`);
    ok(res, doc);
  });

  const create = asyncHandler(async (req, res) => {
    const body = clean(req, null);
    if (beforeSave) await beforeSave(req, body, null);
    const doc = await Model.create(body);
    await logActivity(req, 'created', entity, doc, label(doc));
    ok(res, doc, 201);
  });

  const update = asyncHandler(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) throw new ApiError(404, `${entity} not found`);
    const body = clean(req, doc);
    if (beforeSave) await beforeSave(req, body, doc);
    doc.set(body);
    await doc.save();
    await logActivity(req, 'updated', entity, doc, label(doc));
    ok(res, doc);
  });

  const remove = asyncHandler(async (req, res) => {
    const doc = await Model.findById(req.params.id);
    if (!doc) throw new ApiError(404, `${entity} not found`);
    if (beforeDelete) await beforeDelete(req, doc);
    await doc.deleteOne();
    await logActivity(req, 'deleted', entity, doc, label(doc));
    ok(res, { id: req.params.id });
  });

  return { publicList, publicGet, adminList, adminGet, create, update, remove };
}
