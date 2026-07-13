import express from 'express';
import { getDashboardSummary } from '../controllers/dashboardController.js';
import protect from '../middlewares/auth.js';

const router = express.Router();

// Admin-only dashboard totals
router.get('/', protect, getDashboardSummary);

export default router;
