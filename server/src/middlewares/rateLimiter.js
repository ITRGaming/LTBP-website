import rateLimit from 'express-rate-limit';
import ApiResponse from '../utils/apiResponse.js';

/**
 * Configure rate limiter using environment settings or default fallbacks.
 */
const apiLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS, 10) || 15 * 60 * 1000, // 15 mins default
  max: parseInt(process.env.RATE_LIMIT_MAX, 10) || 100, // limit each IP to 100 requests per window
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req, res, next, options) => {
    // Return standard formatted JSON error on limit hit
    res.status(options.statusCode).json({
      success: false,
      message: `Too many requests from this IP. Please try again after ${Math.ceil((options.windowMs) / 60000)} minutes.`
    });
  }
});

export default apiLimiter;
