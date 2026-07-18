import { loginAdmin, resetAdminPassword, changeAdminPassword } from '../services/authService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Authenticate admin & get token
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const result = await loginAdmin(email, password);
  
  new ApiResponse(200, result, 'Login successful. Session initiated.').send(res);
});

/**
 * @desc    Reset admin password using token or emergency secret
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
export const resetPassword = asyncHandler(async (req, res) => {
  const { email, newPassword, token, recoverySecret } = req.body;
  
  await resetAdminPassword(email, newPassword, token, recoverySecret);
  
  new ApiResponse(200, null, 'Password reset successful. Please login with your new password.').send(res);
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  await changeAdminPassword(req.admin._id, currentPassword, newPassword);
  new ApiResponse(200, null, 'Password changed successfully.').send(res);
});
