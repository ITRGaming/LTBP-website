import express from 'express';
import * as settingsController from '../controllers/settingsController.js';
import protect from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';
import { validateUpdateSettings } from '../validators/settingsValidator.js';

const router = express.Router();

// Public route to retrieve site-wide branding & contact details
router.get('/', settingsController.getSettings);

// Admin-only route to update global website information
router.put(
  '/',
  protect,
  upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'heroImage', maxCount: 1 }
  ]),
  validateUpdateSettings,
  settingsController.updateSettings
);

export default router;
