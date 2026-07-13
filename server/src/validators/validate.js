import { validationResult } from 'express-validator';
import ApiError from '../utils/apiError.js';

/**
 * Middleware that intercepts validation results from express-validator.
 * If validation fails, throws a structured ApiError.
 */
export const validateFields = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  // Format validation errors into a clean array
  const formattedErrors = errors.array().map(err => ({
    field: err.path || err.param, // handles older express-validator fields
    message: err.msg
  }));

  throw new ApiError(400, 'Validation failed: Invalid request payload.', formattedErrors);
};

export default validateFields;
