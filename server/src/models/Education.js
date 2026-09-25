import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    institution: { type: String, required: true, trim: true },
    degree: { type: String, required: true, trim: true },
    subject: { type: String, trim: true },
    startYear: String,
    endYear: String,
    result: { type: String, trim: true },
    description: { type: String, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Education', schema);
