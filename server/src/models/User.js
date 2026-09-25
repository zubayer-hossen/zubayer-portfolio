import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { ROLE_LIST } from '../constants/roles.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: [10, 'Password must be at least 10 characters'], select: false },
    role: { type: String, enum: ROLE_LIST, default: 'editor' },
    isActive: { type: Boolean, default: true },
    lastLoginAt: Date,
    refreshTokens: { type: [String], select: false, default: [] },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    delete ret.password;
    delete ret.refreshTokens;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('User', userSchema);
