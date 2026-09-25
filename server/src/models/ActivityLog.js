import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: String,
  action: { type: String, required: true }, // created | updated | deleted | logged_in ...
  entity: String,
  entityId: String,
  summary: String,
  createdAt: { type: Date, default: Date.now, index: true, expires: 60 * 60 * 24 * 365 },
});

export default mongoose.model('ActivityLog', schema);
