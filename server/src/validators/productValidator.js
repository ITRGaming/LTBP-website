import { body } from 'express-validator';
import validateFields from './validate.js';

export const validateCreateProduct = [
  body('name')
    .notEmpty().withMessage('Product name is required.')
    .trim(),
  body('shortDescription')
    .notEmpty().withMessage('Short description is required.')
    .isLength({ max: 300 }).withMessage('Short description cannot exceed 300 characters.')
    .trim(),
  body('description')
    .notEmpty().withMessage('Full description is required.')
    .trim(),
  body('category')
    .notEmpty().withMessage('Category is required.')
    .trim(),
  body('material')
    .optional()
    .trim(),
  body('isFeatured')
    .optional()
    .isBoolean().withMessage('isFeatured must be a boolean.'),
  body('isActive')
    .optional()
    .isBoolean().withMessage('isActive must be a boolean.'),
  validateFields
];

export const validateUpdateProduct = [
  body('name')
    .optional()
    .notEmpty().withMessage('Product name cannot be empty if provided.')
    .trim(),
  body('shortDescription')
    .optional()
    .isLength({ max: 300 }).withMessage('Short description cannot exceed 300 characters.')
    .trim(),
  body('description')
    .optional()
    .notEmpty().withMessage('Full description cannot be empty if provided.')
    .trim(),
  body('category')
    .optional()
    .notEmpty().withMessage('Category cannot be empty if provided.')
    .trim(),
  body('material')
    .optional()
    .trim(),
  body('isFeatured')
    .optional()
    .custom((val) => val === 'true' || val === 'false' || typeof val === 'boolean')
    .withMessage('isFeatured must be a boolean or boolean string.'),
  body('isActive')
    .optional()
    .custom((val) => val === 'true' || val === 'false' || typeof val === 'boolean')
    .withMessage('isActive must be a boolean or boolean string.'),
  validateFields
];
