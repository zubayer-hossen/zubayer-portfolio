import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    subject: { type: String, required: true, trim: true },
    message: { type: String, required: true, trim: true },
    budget: { type: String, trim: true },
    projectType: { type: String, trim: true },
    status: { type: String, enum: ['new', 'read', 'replied', 'archived'], default: 'new', index: true },
    ipHash: { type: String, select: false },
  },
  { timestamps: true }
);

export default mongoose.model('ContactMessage', schema);
