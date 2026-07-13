import jwt from 'jsonwebtoken';
import ApiError from '../utils/apiError.js';
import asyncHandler from '../utils/asyncHandler.js';
import Admin from '../models/Admin.js';

/**
 * Authentication Middleware.
 * Secures routes by checking for a valid Bearer JWT.
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // 1. Check for token in Authorization header (standard)
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  // 2. Check cookies (optional, for future flexibility)
  else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }

  // Verify token exists
  if (!token) {
    throw new ApiError(401, 'Access denied. No authentication token provided.');
  }

  try {
    // Verify token signature
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find the Admin in the database (future ready: supports multiple admins)
    const currentAdmin = await Admin.findById(decoded.id).select('-password');
    if (!currentAdmin) {
      throw new ApiError(401, 'The admin user belonging to this token no longer exists.');
    }

    // Attach admin context to request object
    req.admin = currentAdmin;
    req.user = currentAdmin; // Alias for general compatibility
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      throw new ApiError(401, 'Authentication token has expired. Please log in again.');
    }
    throw new ApiError(401, 'Unauthorized access. Invalid signature or corrupted token.');
  }
});
export default protect;
