import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signAccess, signRefresh, setAuthCookies, clearAuthCookies, sha256 } from '../utils/token.js';
import { logActivity } from '../services/activityLog.service.js';
import { ok } from './crud.controller.js';

const MAX_SESSIONS = 5;
// Compared against when the email is unknown so response time does not reveal valid emails.
const DUMMY_HASH = bcrypt.hashSync('not-a-real-password', 10);

async function startSession(res, user) {
  const access = signAccess(user);
  const refresh = signRefresh(user);
  user.refreshTokens = [...(user.refreshTokens || []), sha256(refresh)].slice(-MAX_SESSIONS);
  user.lastLoginAt = new Date();
  await user.save();
  setAuthCookies(res, access, refresh);
}

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password +refreshTokens');
  const valid = await bcrypt.compare(password, user?.password || DUMMY_HASH);
  if (!user || !valid || !user.isActive) throw new ApiError(401, 'Incorrect email or password.');
  await startSession(res, user);
  await logActivity({ user }, 'logged_in', 'Auth', user, user.email);
  ok(res, user);
});

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.refresh_token;
  if (!token) throw new ApiError(401, 'Please log in to continue.');
  let payload;
  try {
    payload = jwt.verify(token, env.JWT_REFRESH_SECRET);
  } catch {
    clearAuthCookies(res);
    throw new ApiError(401, 'Your session has expired. Please log in again.');
  }
  const user = await User.findById(payload.sub).select('+refreshTokens');
  const hash = sha256(token);
  if (!user || !user.isActive || !user.refreshTokens.includes(hash)) {
    if (user) {
      user.refreshTokens = []; // possible token reuse: revoke every session
      await user.save();
    }
    clearAuthCookies(res);
    throw new ApiError(401, 'Your session is no longer valid. Please log in again.');
  }
  user.refreshTokens = user.refreshTokens.filter((h) => h !== hash); // rotate
  await startSession(res, user);
  ok(res, user);
});

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.refresh_token;
  if (token) {
    try {
      const { sub } = jwt.verify(token, env.JWT_REFRESH_SECRET);
      await User.updateOne({ _id: sub }, { $pull: { refreshTokens: sha256(token) } });
    } catch {
      /* ignore invalid token */
    }
  }
  clearAuthCookies(res);
  ok(res, { loggedOut: true });
});

export const me = asyncHandler(async (req, res) => ok(res, req.user));

export const changePassword = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('+password +refreshTokens');
  if (!(await user.comparePassword(req.body.currentPassword))) throw new ApiError(400, 'Current password is incorrect.');
  user.password = req.body.newPassword;
  user.refreshTokens = []; // sign out other devices
  await user.save();
  await startSession(res, user);
  await logActivity(req, 'updated', 'Auth', user, 'Changed password');
  ok(res, { changed: true });
});
