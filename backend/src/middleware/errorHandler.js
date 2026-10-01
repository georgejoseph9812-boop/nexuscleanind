import { logger } from '../utils/logger.js';

export const errorHandler = (err, req, res, next) => {
  logger.error(`${req.method} ${req.originalUrl} -`, err.message || err);

  const statusCode = err.statusCode || (res.statusCode >= 400 ? res.statusCode : 500);
  const errorCode = err.code || (
    statusCode === 404 ? 'NOT_FOUND' :
    statusCode === 400 ? 'BAD_REQUEST' :
    statusCode === 401 ? 'UNAUTHORIZED' :
    statusCode === 403 ? 'FORBIDDEN' :
    statusCode === 422 ? 'VALIDATION_ERROR' :
    'INTERNAL_SERVER_ERROR'
  );

  const isProduction = process.env.NODE_ENV === 'production';
  const safeMessage = (statusCode === 500 && isProduction)
    ? 'An internal server error occurred. Please contact municipal support.'
    : (err.message || 'An unexpected error occurred.');

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message: safeMessage,
      ...(isProduction ? {} : { stack: err.stack })
    }
  });
};
