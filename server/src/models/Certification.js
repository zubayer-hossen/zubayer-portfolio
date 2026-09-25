import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    organization: { type: String, required: true, trim: true },
    issueDate: Date,
    credentialId: { type: String, trim: true },
    url: { type: String, trim: true },
    file: { type: String, trim: true }, // certificate PDF
    image: { type: String, trim: true }, // certificate image
    skills: [String],
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('Certification', schema);
