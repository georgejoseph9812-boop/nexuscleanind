/**
 * Standard API Response Utilities
 * Nexus Clean API specification compliant
 */

export const successResponse = (res, data = {}, message = 'Success', statusCode = 200, extra = {}) => {
  return res.status(statusCode).json({
    success: true,
    data,
    message,
    ...extra
  });
};

export const errorResponse = (res, code = 'INTERNAL_ERROR', message = 'An error occurred', statusCode = 500, details = null) => {
  const payload = {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {})
    }
  };
  return res.status(statusCode).json(payload);
};
