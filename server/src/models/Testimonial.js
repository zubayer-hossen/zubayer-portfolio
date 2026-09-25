import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    clientName: { type: String, required: true, trim: true },
    photo: { type: String, trim: true },
    company: { type: String, trim: true },
    position: { type: String, trim: true },
    rating: { type: Number, min: 1, max: 5, default: 5 },
    text: { type: String, required: true, trim: true },
    projectName: { type: String, trim: true },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending', index: true },
    order: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model('Testimonial', schema);
