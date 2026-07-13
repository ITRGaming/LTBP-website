import ApiError from '../utils/apiError.js';

/**
 * Global Express Error Handling Middleware.
 * Standardizes all application errors to a consistent JSON response.
 */
const errorHandler = (err, req, res, next) => {
  let error = err;

  // If the error is not an instance of ApiError, classify it
  if (!(error instanceof ApiError)) {
    const statusCode = error.statusCode || (error.name === 'ValidationError' ? 400 : 500);
    const message = error.message || 'Internal Server Error';
    
    // Check for Mongoose Duplicate Key Error
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      error = new ApiError(400, `A record with this ${field} already exists.`, [
        { field, message: `Duplicate value: '${error.keyValue[field]}'` }
      ]);
    }
    // Check for Mongoose Cast Error (e.g. invalid ObjectId)
    else if (error.name === 'CastError') {
      error = new ApiError(400, `Invalid data format for path: ${error.path}`, [
        { field: error.path, message: `Could not cast value '${error.value}' to type ${error.kind}` }
      ]);
    }
    // Check for Mongoose validation errors
    else if (error.name === 'ValidationError') {
      const formattedErrors = Object.values(error.errors).map(el => ({
        field: el.path,
        message: el.message
      }));
      error = new ApiError(400, 'Database validation failed.', formattedErrors);
    }
    // Check for JWT errors
    else if (error.name === 'JsonWebTokenError') {
      error = new ApiError(401, 'Unauthorized: Invalid authentication token.');
    }
    else if (error.name === 'TokenExpiredError') {
      error = new ApiError(401, 'Unauthorized: Authentication token has expired.');
    }
    // General fallback
    else {
      error = new ApiError(statusCode, message, error.errors || []);
    }
  }

  // Set response status and body
  const response = {
    success: false,
    message: error.message,
    ...(error.errors && error.errors.length > 0 && { errors: error.errors }),
    // Include stack trace only in development environment
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  };

  // Log server errors (500s) for debugging
  if (response.statusCode === 500 || error.statusCode === 500) {
    console.error(`[SERVER ERROR]`, err);
  }

  return res.status(error.statusCode || 500).json(response);
};

export default errorHandler;
