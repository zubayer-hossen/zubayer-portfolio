import mongoose from 'mongoose';
import { env } from './env.js';

export async function connectDB() {
  mongoose.set('strictQuery', true);
  try {
    await mongoose.connect(env.MONGO_URI, { serverSelectionTimeoutMS: 10000 });
    console.log(`[db] MongoDB connected (${mongoose.connection.name})`);
  } catch (err) {
    console.error('\n[db] Could not connect to MongoDB.');
    console.error('[db] Check MONGO_URI in server/.env and make sure MongoDB is running (or Atlas IP access is open).');
    console.error(`[db] ${err.message}\n`);
    process.exit(1);
  }
}
