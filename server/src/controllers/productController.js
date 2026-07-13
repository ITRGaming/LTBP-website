import * as productService from '../services/productService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all active/non-deleted products with filtering
 * @route   GET /api/products
 * @access  Public (admin can see inactive if queried)
 */
export const getProducts = asyncHandler(async (req, res) => {
  // If user is admin (auth token is present), we can let them query inactive items
  const query = { ...req.query };
  if (!req.admin) {
    query.activeOnly = 'true';
  }

  const result = await productService.getAllProducts(query);
  new ApiResponse(200, result, 'Products retrieved successfully.').send(res);
});

/**
 * @desc    Get product details by unique slug
 * @route   GET /api/products/:slug
 * @access  Public
 */
export const getProductBySlug = asyncHandler(async (req, res) => {
  const { slug } = req.params;
  const product = await productService.getProductBySlug(slug);
  new ApiResponse(200, product, 'Product details retrieved successfully.').send(res);
});

/**
 * @desc    Get all featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await productService.getFeaturedProducts();
  new ApiResponse(200, products, 'Featured products retrieved successfully.').send(res);
});

/**
 * @desc    Get products by category
 * @route   GET /api/products/category/:categoryName
 * @access  Public
 */
export const getProductsByCategory = asyncHandler(async (req, res) => {
  const { categoryName } = req.params;
  const products = await productService.getProductsByCategoryName(categoryName);
  new ApiResponse(200, products, `Products in category '${categoryName}' retrieved successfully.`).send(res);
});

/**
 * @desc    Create a new product
 * @route   POST /api/products
 * @access  Private (Admin only)
 */
export const createProduct = asyncHandler(async (req, res) => {
  // req.files is populated by multer upload.array('images')
  const files = req.files || [];
  const product = await productService.createProduct(req.body, files);
  new ApiResponse(201, product, 'Product created successfully.').send(res);
});

/**
 * @desc    Update an existing product
 * @route   PUT /api/products/:id
 * @access  Private (Admin only)
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const files = req.files || [];
  const product = await productService.updateProduct(id, req.body, files);
  new ApiResponse(200, product, 'Product updated successfully.').send(res);
});

/**
 * @desc    Soft delete a product
 * @route   DELETE /api/products/:id
 * @access  Private (Admin only)
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await productService.deleteProduct(id);
  new ApiResponse(200, null, 'Product deleted successfully.').send(res);
});

/**
 * @desc    Toggle product featured status
 * @route   PATCH /api/products/:id/toggle-featured
 * @access  Private (Admin only)
 */
export const toggleFeatured = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.toggleProductFeatured(id);
  new ApiResponse(200, product, `Product featured status toggled to ${product.isFeatured}.`).send(res);
});

/**
 * @desc    Toggle product active status
 * @route   PATCH /api/products/:id/toggle-active
 * @access  Private (Admin only)
 */
export const toggleActive = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const product = await productService.toggleProductActive(id);
  new ApiResponse(200, product, `Product active status toggled to ${product.isActive}.`).send(res);
});
