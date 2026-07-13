import Product from '../models/Product.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import ApiError from '../utils/apiError.js';
import slugify from '../utils/slugify.js';

/**
 * Get all active, non-deleted products with optional search, category filter, and pagination
 */
export const getAllProducts = async (query = {}) => {
  const { search, category, page = 1, limit = 10, sort = '-createdAt', activeOnly = 'true' } = query;

  const mongoQuery = { isDeleted: false };

  // Filter by active status (customers see active only, admin can see all)
  if (activeOnly === 'true') {
    mongoQuery.isActive = true;
  }

  // Filter by category
  if (category) {
    mongoQuery.category = category;
  }

  // Text search on name/description
  if (search) {
    mongoQuery.$text = { $search: search };
  }

  const parsedPage = Math.max(1, parseInt(page, 10));
  const parsedLimit = Math.max(1, parseInt(limit, 10));
  const skip = (parsedPage - 1) * parsedLimit;

  // Execute query
  let productsQuery = Product.find(mongoQuery);

  // If text search, sort by text score relevance unless a specific sort is requested
  if (search && sort === '-createdAt') {
    productsQuery = productsQuery
      .select({ score: { $meta: 'textScore' } })
      .sort({ score: { $meta: 'textScore' } });
  } else {
    productsQuery = productsQuery.sort(sort);
  }

  const products = await productsQuery.skip(skip).limit(parsedLimit);
  const total = await Product.countDocuments(mongoQuery);

  return {
    products,
    pagination: {
      total,
      page: parsedPage,
      limit: parsedLimit,
      pages: Math.ceil(total / parsedLimit),
    },
  };
};

/**
 * Get product details by unique slug
 */
export const getProductBySlug = async (slug) => {
  const product = await Product.findOne({ slug, isDeleted: false });
  if (!product) {
    throw new ApiError(404, `Product with slug '${slug}' not found.`);
  }
  return product;
};

/**
 * Get featured products
 */
export const getFeaturedProducts = async () => {
  return await Product.find({ isFeatured: true, isActive: true, isDeleted: false }).sort('-createdAt');
};

/**
 * Get products by category (separate utility api)
 */
export const getProductsByCategoryName = async (categoryName) => {
  return await Product.find({ category: categoryName, isActive: true, isDeleted: false }).sort('-createdAt');
};

/**
 * Create a new product
 */
export const createProduct = async (productData, files = []) => {
  // Check if name is unique
  const existingProduct = await Product.findOne({ name: productData.name, isDeleted: false });
  if (existingProduct) {
    throw new ApiError(400, 'A product with this name already exists.');
  }

  // Process and upload images
  const uploadedImages = [];
  if (files && files.length > 0) {
    for (const file of files) {
      const uploadResult = await uploadImage(file.path, 'products');
      uploadedImages.push(uploadResult);
    }
  }

  // Parse arrays if they are sent as strings (e.g. from form-data)
  const availableColors = typeof productData.availableColors === 'string' 
    ? productData.availableColors.split(',').map(s => s.trim()) 
    : productData.availableColors;

  const availableSizes = typeof productData.availableSizes === 'string' 
    ? productData.availableSizes.split(',').map(s => s.trim()) 
    : productData.availableSizes;

  const features = typeof productData.features === 'string' 
    ? productData.features.split(',').map(s => s.trim()) 
    : productData.features;

  const product = new Product({
    ...productData,
    images: uploadedImages,
    availableColors,
    availableSizes,
    features,
  });

  await product.save();
  return product;
};

/**
 * Update an existing product
 */
export const updateProduct = async (id, updateData, files = []) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }

  // If changing name, ensure uniqueness
  if (updateData.name && updateData.name !== product.name) {
    const existingName = await Product.findOne({ name: updateData.name, isDeleted: false });
    if (existingName) {
      throw new ApiError(400, 'A product with this name already exists.');
    }
    product.name = updateData.name;
    product.slug = slugify(updateData.name);
  }

  // Process new image uploads
  let uploadedImages = [...(product.images || [])];
  if (files && files.length > 0) {
    for (const file of files) {
      const uploadResult = await uploadImage(file.path, 'products');
      uploadedImages.push(uploadResult);
    }
  }

  // Handle image deletions if front-end requests removal of specific public IDs
  if (updateData.deletedImages) {
    const imagesToDelete = typeof updateData.deletedImages === 'string'
      ? updateData.deletedImages.split(',')
      : updateData.deletedImages;

    for (const publicId of imagesToDelete) {
      await deleteImage(publicId);
      uploadedImages = uploadedImages.filter(img => img.public_id !== publicId);
    }
  }

  // Helper to parse comma separated values if needed
  const parseField = (field) => {
    if (updateData[field] !== undefined) {
      return typeof updateData[field] === 'string'
        ? updateData[field].split(',').map(s => s.trim())
        : updateData[field];
    }
    return product[field];
  };

  // Update scalar fields
  const scalarFields = [
    'shortDescription', 'description', 'category', 'material', 
    'isFeatured', 'isActive'
  ];

  scalarFields.forEach(field => {
    if (updateData[field] !== undefined) {
      // Handle boolean parses if from form-data
      if (updateData[field] === 'true') product[field] = true;
      else if (updateData[field] === 'false') product[field] = false;
      else product[field] = updateData[field];
    }
  });

  // Update array fields
  product.availableColors = parseField('availableColors');
  product.availableSizes = parseField('availableSizes');
  product.features = parseField('features');
  product.images = uploadedImages;

  await product.save();
  return product;
};

/**
 * Soft delete a product
 */
export const deleteProduct = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new ApiError(404, 'Product not found or already deleted.');
  }

  // Perform soft delete
  product.isDeleted = true;
  product.isActive = false;
  await product.save();

  // We could also delete related images from Cloudinary, but keeping them
  // or cleaning them up later is standard practice. Let's keep them in soft delete.
  return true;
};

/**
 * Toggle featured status
 */
export const toggleProductFeatured = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }
  product.isFeatured = !product.isFeatured;
  await product.save();
  return product;
};

/**
 * Toggle active status
 */
export const toggleProductActive = async (id) => {
  const product = await Product.findOne({ _id: id, isDeleted: false });
  if (!product) {
    throw new ApiError(404, 'Product not found.');
  }
  product.isActive = !product.isActive;
  await product.save();
  return product;
};
