import mongoose from 'mongoose';
import app from './app.js';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';

await connectDB();
const server = app.listen(env.PORT, () => {
  console.log(`[server] API ready on http://localhost:${env.PORT}/api/v1  (${env.NODE_ENV})`);
  if (!env.cloudinaryEnabled) console.log('[server] Cloudinary not configured — uploads are stored locally in server/uploads (development only).');
});

const shutdown = (signal) => {
  console.log(`\n[server] ${signal} received, shutting down…`);
  server.close(async () => {
    await mongoose.connection.close();
    process.exit(0);
  });
};
['SIGINT', 'SIGTERM'].forEach((s) => process.on(s, () => shutdown(s)));
process.on('unhandledRejection', (e) => console.error('[unhandledRejection]', e));
