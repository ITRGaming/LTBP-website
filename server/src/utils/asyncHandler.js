/**
 * Wraps async functions in Express controllers to forward any thrown errors to the next middleware (global error handler).
 * @param {Function} requestHandler - The async controller function
 * @returns {Function} Express route handler function
 */
const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise.resolve(requestHandler(req, res, next)).catch((err) => next(err));
  };
};

export default asyncHandler;
