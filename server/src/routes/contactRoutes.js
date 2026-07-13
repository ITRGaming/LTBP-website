import express from 'express';
import * as contactController from '../controllers/contactController.js';
import protect from '../middlewares/auth.js';
import { validateContactSubmission } from '../validators/contactValidator.js';

const router = express.Router();

// Public submission path
router.post('/', validateContactSubmission, contactController.submitContactForm);

// Admin-only management endpoints
router.get('/', protect, contactController.getContactMessages);
router.get('/:id', protect, contactController.getContactMessageById);
router.delete('/:id', protect, contactController.deleteContactMessage);

export default router;
