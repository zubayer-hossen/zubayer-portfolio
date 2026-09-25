import mongoose from 'mongoose';

const schema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    type: { type: String, enum: ['image', 'video', 'pdf', 'other'], default: 'image' },
    format: String,
    size: Number,
    originalName: String,
    folder: { type: String, default: 'general' },
    storage: { type: String, enum: ['cloudinary', 'local'], default: 'local' },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

export default mongoose.model('Media', schema);
