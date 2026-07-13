import { body } from 'express-validator';
import validateFields from './validate.js';

export const validateContactSubmission = [
  body('name')
    .notEmpty().withMessage('Name is required.')
    .trim(),
  body('email')
    .isEmail().withMessage('Please provide a valid email address.')
    .normalizeEmail(),
  body('phone')
    .notEmpty().withMessage('Phone number is required.')
    .trim(),
  body('message')
    .notEmpty().withMessage('Message content is required.')
    .trim(),
  validateFields
];
