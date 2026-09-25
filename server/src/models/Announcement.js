import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    text: { type: String, required: true, trim: true, maxlength: 200 },
    link: { type: String, trim: true },
    linkLabel: { type: String, trim: true },
    type: { type: String, enum: ['info', 'success', 'warning'], default: 'info' },
    startsAt: Date,
    endsAt: Date,
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Announcement', schema);
