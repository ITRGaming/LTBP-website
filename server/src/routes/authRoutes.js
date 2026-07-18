import express from 'express';
import { login, resetPassword, changePassword } from '../controllers/authController.js';
import { validateLogin, validateResetPassword, validateChangePassword } from '../validators/authValidator.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

// Public routes for admin authentication
router.post('/login', validateLogin, login);
router.post('/reset-password', validateResetPassword, resetPassword);
router.post('/change-password', protect, validateChangePassword, changePassword);

export default router;
