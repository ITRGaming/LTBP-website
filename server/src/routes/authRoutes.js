import express from 'express';
import { login, resetPassword } from '../controllers/authController.js';
import { validateLogin, validateResetPassword } from '../validators/authValidator.js';

const router = express.Router();

// Public routes for admin authentication
router.post('/login', validateLogin, login);
router.post('/reset-password', validateResetPassword, resetPassword);

export default router;
