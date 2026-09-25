import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    icon: { type: String, trim: true, default: 'Code2' }, // lucide-react icon name
    description: { type: String, trim: true },
    features: [String],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Service', schema);
