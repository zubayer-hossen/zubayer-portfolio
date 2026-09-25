import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    platform: { type: String, required: true, trim: true }, // github, linkedin, x, facebook, youtube, email, website...
    label: { type: String, trim: true },
    url: { type: String, required: true, trim: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('SocialLink', schema);
