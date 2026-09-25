import Media from '../models/Media.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from '../utils/ApiError.js';
import { storeFile, removeFile } from '../services/media.service.js';
import { logActivity } from '../services/activityLog.service.js';
import { ok, paginate } from './crud.controller.js';

const FOLDERS = ['general', 'profile', 'projects', 'blog', 'certificates', 'resume', 'videos'];

export const uploadMedia = asyncHandler(async (req, res) => {
  if (!req.files?.length) throw new ApiError(400, 'Choose at least one file to upload.');
  const folder = FOLDERS.includes(req.body.folder) ? req.body.folder : 'general';
  const saved = [];
  for (const file of req.files) {
    const info = await storeFile(file, folder);
    saved.push(await Media.create({ ...info, originalName: file.originalname, folder, uploadedBy: req.user._id }));
  }
  await logActivity(req, 'created', 'Media', saved[0], `Uploaded ${saved.length} file(s)`);
  ok(res, saved, 201);
});

export const listMedia = asyncHandler(async (req, res) =>
  ok(res, await paginate(Media, req, { searchFields: ['originalName'], filterFields: ['type', 'folder'], defaultSort: '-createdAt' }))
);

export const deleteMedia = asyncHandler(async (req, res) => {
  const media = await Media.findById(req.params.id);
  if (!media) throw new ApiError(404, 'File not found');
  await removeFile(media);
  await media.deleteOne();
  await logActivity(req, 'deleted', 'Media', media, media.originalName);
  ok(res, { id: req.params.id });
});
