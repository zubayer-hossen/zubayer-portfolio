import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    company: { type: String, required: true, trim: true },
    position: { type: String, required: true, trim: true },
    type: { type: String, trim: true }, // Full-time, Internship, Freelance...
    location: { type: String, trim: true },
    startDate: Date,
    endDate: Date,
    current: { type: Boolean, default: false },
    description: { type: String, trim: true },
    responsibilities: [String],
    technologies: [String],
    achievements: [String],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Experience', schema);
