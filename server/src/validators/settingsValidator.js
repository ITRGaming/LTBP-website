import { body } from 'express-validator';
import validateFields from './validate.js';

export const validateUpdateSettings = [
  body('businessName')
    .optional()
    .notEmpty().withMessage('Business name cannot be empty.')
    .trim(),
  body('phone')
    .optional()
    .notEmpty().withMessage('Phone number cannot be empty.')
    .trim(),
  body('whatsapp')
    .optional()
    .notEmpty().withMessage('WhatsApp number cannot be empty.')
    .trim(),
  body('email')
    .optional()
    .isEmail().withMessage('Please provide a valid business email address.')
    .normalizeEmail(),
  body('instagram')
    .optional()
    .trim(),
  body('address')
    .optional()
    .trim(),
  body('aboutText')
    .optional()
    .trim(),
  validateFields
];
