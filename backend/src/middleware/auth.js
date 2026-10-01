import jwt from 'jsonwebtoken';
import { config } from '../config/env.js';
import { databaseService } from '../services/databaseService.js';
import { errorResponse } from '../utils/apiResponse.js';

export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return errorResponse(res, 'UNAUTHORIZED', 'Authentication token required.', 401);
    }

    const token = authHeader.split(' ')[1];

    // Support demo mock tokens during migration
    if (token === 'mock-jwt-token-nexus-clean') {
      const user = await databaseService.findUserById('USR-CITIZEN-01');
      req.user = user;
      return next();
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      const user = await databaseService.findUserById(decoded.id);

      if (!user) {
        return errorResponse(res, 'UNAUTHORIZED', 'User associated with token no longer exists.', 401);
      }

      req.user = user;
      next();
    } catch (jwtErr) {
      return errorResponse(res, 'INVALID_TOKEN', 'Token is expired or invalid.', 401);
    }
  } catch (err) {
    next(err);
  }
};

export const authorize = (roles = []) => {
  return (req, res, next) => {
    if (!req.user) {
      return errorResponse(res, 'UNAUTHORIZED', 'Authentication required.', 401);
    }

    if (roles.length && !roles.includes(req.user.role)) {
      return errorResponse(
        res,
        'FORBIDDEN',
        `Role "${req.user.role}" does not have permission to perform this action.`,
        403
      );
    }

    next();
  };
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }

  const token = authHeader.split(' ')[1];
  if (token === 'mock-jwt-token-nexus-clean') {
    req.user = await databaseService.findUserById('USR-CITIZEN-01');
    return next();
  }

  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    req.user = await databaseService.findUserById(decoded.id);
  } catch (e) {
    // Ignore invalid token in optional auth
  }
  next();
};
