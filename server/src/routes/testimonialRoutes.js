import express from 'express';
import * as testimonialController from '../controllers/testimonialController.js';
import protect from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';
import { validateCreateTestimonial, validateUpdateTestimonial } from '../validators/testimonialValidator.js';

const router = express.Router();

// Public route for customer viewing
router.get('/', testimonialController.getTestimonials);

// Admin protected routes for managing testimonial content
router.post(
  '/', 
  protect, 
  upload.single('image'), 
  validateCreateTestimonial, 
  testimonialController.createTestimonial
);

router.put(
  '/:id', 
  protect, 
  upload.single('image'), 
  validateUpdateTestimonial, 
  testimonialController.updateTestimonial
);

router.delete('/:id', protect, testimonialController.deleteTestimonial);

export default router;
