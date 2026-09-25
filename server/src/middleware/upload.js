import multer from 'multer';
import { ApiError } from '../utils/ApiError.js';

const allowed = /^(image\/(png|jpe?g|webp|gif|avif)|video\/(mp4|webm|quicktime)|application\/pdf)$/;

export const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 50 * 1024 * 1024, files: 10 },
  fileFilter: (_req, file, cb) =>
    allowed.test(file.mimetype) ? cb(null, true) : cb(new ApiError(400, 'Unsupported file type. Use PNG, JPG, WebP, GIF, AVIF, MP4, WebM or PDF.')),
});
