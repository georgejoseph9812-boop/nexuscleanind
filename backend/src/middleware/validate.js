import { errorResponse } from '../utils/apiResponse.js';

export const validate = (schemaValidator) => {
  return (req, res, next) => {
    const error = schemaValidator(req.body);
    if (error) {
      return errorResponse(res, 'VALIDATION_ERROR', error, 422);
    }
    next();
  };
};
