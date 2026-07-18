import { body } from 'express-validator';
import validateFields from './validate.js';

export const validateLogin = [
  body('email')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage('Password is required.'),
  validateFields
];

export const validateResetPassword = [
  body('email')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long.'),
  body().custom((value) => {
    if (!value.token && !value.recoverySecret) {
      throw new Error('Either a reset token or an emergency recoverySecret must be provided.');
    }
    return true;
  }),
  validateFields
];

export const validateChangePassword = [
  body('currentPassword')
    .notEmpty().withMessage('Current password is required.'),
  body('newPassword')
    .isLength({ min: 8 }).withMessage('New password must be at least 8 characters long.'),
  validateFields
];
