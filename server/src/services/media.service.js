import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import cloudinary from '../config/cloudinary.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const uploadsDir = path.resolve(__dirname, '../../uploads');

const typeOf = (mime) => (mime.startsWith('image/') ? 'image' : mime.startsWith('video/') ? 'video' : mime === 'application/pdf' ? 'pdf' : 'other');
const safeName = (n) => n.toLowerCase().replace(/[^a-z0-9.\-_]+/g, '-').replace(/-+/g, '-').slice(-80);

export async function storeFile(file, folder = 'general') {
  const type = typeOf(file.mimetype);

  if (env.cloudinaryEnabled) {
    const result = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `portfolio/${folder}`,
          resource_type: type === 'pdf' ? 'raw' : 'auto',
          use_filename: true,
          unique_filename: true,
        },
        (err, res) => (err ? reject(new ApiError(502, `Cloudinary upload failed: ${err.message}`)) : resolve(res))
      );
      stream.end(file.buffer);
    });
    return {
      url: result.secure_url,
      publicId: result.public_id,
      type,
      format: result.format || path.extname(file.originalname).slice(1),
      size: result.bytes,
      storage: 'cloudinary',
    };
  }

  // Development fallback: local disk (not suitable for most free hosts — use Cloudinary in production).
  const dir = path.join(uploadsDir, folder);
  await fs.mkdir(dir, { recursive: true });
  const name = `${Date.now()}-${safeName(file.originalname)}`;
  await fs.writeFile(path.join(dir, name), file.buffer);
  return {
    url: `${env.SERVER_URL}/uploads/${folder}/${name}`,
    publicId: `${folder}/${name}`,
    type,
    format: path.extname(name).slice(1),
    size: file.size,
    storage: 'local',
  };
}

export async function removeFile(media) {
  try {
    if (media.storage === 'cloudinary') {
      await cloudinary.uploader.destroy(media.publicId, { resource_type: media.type === 'pdf' ? 'raw' : media.type === 'video' ? 'video' : 'image' });
    } else {
      const target = path.resolve(uploadsDir, media.publicId);
      if (target.startsWith(uploadsDir)) await fs.unlink(target);
    }
  } catch (e) {
    console.error('[media] remove failed:', e.message);
  }
}
