import jwt from 'jsonwebtoken';
import Admin from '../models/Admin.js';
import ApiError from '../utils/apiError.js';

/**
 * Generate a JWT token for the admin
 * @param {string} adminId - MongoDB ObjectId of the Admin
 * @returns {string} Signed JWT
 */
const generateToken = (adminId) => {
  return jwt.sign({ id: adminId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '24h'
  });
};

/**
 * Business logic for admin login
 * @param {string} email - Admin email
 * @param {string} password - Admin password
 * @returns {Promise<{admin: object, token: string}>}
 */
export const loginAdmin = async (email, password) => {
  // Find admin by email and explicitly select the password field
  const admin = await Admin.findOne({ email }).select('+password');
  if (!admin) {
    throw new ApiError(401, 'Invalid email or password credentials.');
  }

  // Compare passwords
  const isMatch = await admin.matchPassword(password);
  if (!isMatch) {
    throw new ApiError(401, 'Invalid email or password credentials.');
  }

  // Generate JWT token
  const token = generateToken(admin._id);

  // Strip password from the response object
  const adminResponse = admin.toObject();
  delete adminResponse.password;

  return { admin: adminResponse, token };
};

/**
 * Business logic for resetting admin password
 * @param {string} email - Admin email
 * @param {string} newPassword - New password to set
 * @param {string} token - Reset token from database (optional)
 * @param {string} recoverySecret - Server env recovery secret (optional fallback)
 * @returns {Promise<boolean>} Success status
 */
export const resetAdminPassword = async (email, newPassword, token, recoverySecret) => {
  const admin = await Admin.findOne({ email });
  if (!admin) {
    throw new ApiError(404, 'Admin not found with the provided email.');
  }

  let authorized = false;

  // Option 1: Verification using a JWT reset token or random token
  if (token) {
    if (admin.resetPasswordToken === token && admin.resetPasswordExpire > Date.now()) {
      authorized = true;
    } else {
      throw new ApiError(400, 'Invalid or expired password reset token.');
    }
  } 
  // Option 2: Verification using a master recovery secret from environment variables
  else if (recoverySecret) {
    // We compare with a secret key in .env to allow manual recovery by the hosting engineer
    const expectedSecret = process.env.ADMIN_RESET_SECRET || 'emergency_reset_secret_key_2026';
    if (recoverySecret === expectedSecret) {
      authorized = true;
    } else {
      throw new ApiError(401, 'Invalid recovery secret key.');
    }
  }

  if (!authorized) {
    throw new ApiError(400, 'Missing reset token or recovery secret.');
  }

  // Apply new password
  admin.password = newPassword;
  
  // Clear reset token fields
  admin.resetPasswordToken = undefined;
  admin.resetPasswordExpire = undefined;
  
  await admin.save();
  return true;
};
