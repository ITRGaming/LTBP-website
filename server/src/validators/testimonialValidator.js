import { body } from 'express-validator';
import validateFields from './validate.js';

export const validateCreateTestimonial = [
  body('customerName')
    .notEmpty().withMessage('Customer name is required.')
    .trim(),
  body('message')
    .notEmpty().withMessage('Message is required.')
    .trim(),
  body('source')
    .notEmpty().withMessage('Source is required.')
    .isIn(['WhatsApp', 'Instagram DM', 'Instagram Story', 'Text'])
    .withMessage('Source must be WhatsApp, Instagram DM, Instagram Story, or Text.'),
  body('rating')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),
  body('isFeatured')
    .optional()
    .custom((val) => val === 'true' || val === 'false' || typeof val === 'boolean')
    .withMessage('isFeatured must be a boolean or boolean string.'),
  validateFields
];

export const validateUpdateTestimonial = [
  body('customerName')
    .optional()
    .notEmpty().withMessage('Customer name cannot be empty if provided.')
    .trim(),
  body('message')
    .optional()
    .notEmpty().withMessage('Message cannot be empty if provided.')
    .trim(),
  body('source')
    .optional()
    .isIn(['WhatsApp', 'Instagram DM', 'Instagram Story', 'Text'])
    .withMessage('Source must be WhatsApp, Instagram DM, Instagram Story, or Text.'),
  body('rating')
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be an integer between 1 and 5.'),
  body('isFeatured')
    .optional()
    .custom((val) => val === 'true' || val === 'false' || typeof val === 'boolean')
    .withMessage('isFeatured must be a boolean or boolean string.'),
  validateFields
];
