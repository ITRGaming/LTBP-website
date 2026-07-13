import express from 'express';
import * as productController from '../controllers/productController.js';
import protect from '../middlewares/auth.js';
import upload from '../middlewares/upload.js';
import { validateCreateProduct, validateUpdateProduct } from '../validators/productValidator.js';

const router = express.Router();

// Public routes (No authentication required)
router.get('/', productController.getProducts);
router.get('/featured', productController.getFeaturedProducts);
router.get('/category/:categoryName', productController.getProductsByCategory);
router.get('/:slug', productController.getProductBySlug);

// Admin-only protected routes
router.post(
  '/', 
  protect, 
  upload.array('images', 10), // Limit uploads to max 10 images at once
  validateCreateProduct, 
  productController.createProduct
);

router.put(
  '/:id', 
  protect, 
  upload.array('images', 10), 
  validateUpdateProduct, 
  productController.updateProduct
);

router.delete('/:id', protect, productController.deleteProduct);

// Extra Admin APIs for convenience
router.patch('/:id/toggle-featured', protect, productController.toggleFeatured);
router.patch('/:id/toggle-active', protect, productController.toggleActive);

export default router;
