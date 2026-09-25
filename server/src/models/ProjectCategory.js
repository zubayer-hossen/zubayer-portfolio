import mongoose from 'mongoose';
import slugPlugin from '../utils/slugPlugin.js';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);
schema.plugin(slugPlugin, { source: 'name' });

export default mongoose.model('ProjectCategory', schema);
