import express from 'express';
import authRoutes from './authRoutes.js';
import productRoutes from './productRoutes.js';
import testimonialRoutes from './testimonialRoutes.js';
import contactRoutes from './contactRoutes.js';
import settingsRoutes from './settingsRoutes.js';
import dashboardRoutes from './dashboardRoutes.js';

const router = express.Router();

// Mount modules under respective routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/testimonials', testimonialRoutes);
router.use('/contact', contactRoutes);
router.use('/settings', settingsRoutes);
router.use('/dashboard', dashboardRoutes);

export default router;
