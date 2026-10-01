import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { databaseService } from '../services/databaseService.js';
import { successResponse, errorResponse } from '../utils/apiResponse.js';

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, location, area } = req.body;

    const existing = await databaseService.findUserByEmail(email);
    if (existing) {
      return errorResponse(res, 'CONFLICT', 'An account with this email address already exists.', 409);
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await databaseService.createUser({
      name,
      email,
      password_hash,
      role: 'citizen',
      location: location || 'Civil Lines, Kanpur',
      area: area || 'Civil Lines'
    });

    const token = generateToken(newUser);
    const ecoScore = await databaseService.getEcoScore(newUser.id);
    const userSafe = { ...newUser, ecoScore };
    delete userSafe.password_hash;

    return successResponse(res, { user: userSafe, token }, 'Registration successful.', 201, {
      user: userSafe,
      token
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await databaseService.findUserByEmail(email);
    if (!user) {
      return errorResponse(res, 'INVALID_CREDENTIALS', 'Invalid email or password.', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return errorResponse(res, 'INVALID_CREDENTIALS', 'Invalid email or password.', 401);
    }

    const token = generateToken(user);
    const ecoScore = user.role === 'citizen' ? await databaseService.getEcoScore(user.id) : null;
    const userSafe = { ...user, ...(ecoScore ? { ecoScore } : {}) };
    delete userSafe.password_hash;

    return successResponse(res, { user: userSafe, token }, 'Logged in successfully.', 200, {
      user: userSafe,
      token
    });
  } catch (err) {
    next(err);
  }
};

export const getCurrentUser = async (req, res, next) => {
  try {
    const user = req.user;
    if (!user) {
      return errorResponse(res, 'UNAUTHORIZED', 'Not authenticated', 401);
    }

    const ecoScore = user.role === 'citizen' ? await databaseService.getEcoScore(user.id) : null;
    const userSafe = { ...user, ...(ecoScore ? { ecoScore } : {}) };
    delete userSafe.password_hash;

    return successResponse(res, userSafe, 'User profile retrieved successfully.', 200, {
      user: userSafe
    });
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  return successResponse(res, null, 'Logged out successfully.');
};
