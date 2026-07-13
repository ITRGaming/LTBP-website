import Testimonial from '../models/Testimonial.js';
import { uploadImage, deleteImage } from '../config/cloudinary.js';
import ApiError from '../utils/apiError.js';

/**
 * Get testimonials with optional filters (featured, source, pagination)
 */
export const getAllTestimonials = async (query = {}) => {
  const { featured, source, limit = 50, sort = '-createdAt' } = query;
  
  const mongoQuery = {};
  
  if (featured === 'true') {
    mongoQuery.isFeatured = true;
  }
  
  if (source) {
    mongoQuery.source = source;
  }

  const limitNum = Math.max(1, parseInt(limit, 10));

  return await Testimonial.find(mongoQuery)
    .sort(sort)
    .limit(limitNum);
};

/**
 * Create a new testimonial
 */
export const createTestimonial = async (testimonialData, file = null) => {
  let uploadedImage = undefined;
  
  // If an avatar image is uploaded
  if (file) {
    const uploadResult = await uploadImage(file.path, 'testimonials');
    uploadedImage = uploadResult;
  }

  const ratingVal = testimonialData.rating ? parseInt(testimonialData.rating, 10) : undefined;

  const testimonial = new Testimonial({
    customerName: testimonialData.customerName,
    message: testimonialData.message,
    source: testimonialData.source,
    rating: ratingVal,
    isFeatured: testimonialData.isFeatured === 'true' || testimonialData.isFeatured === true,
    image: uploadedImage
  });

  await testimonial.save();
  return testimonial;
};

/**
 * Update an existing testimonial
 */
export const updateTestimonial = async (id, updateData, file = null) => {
  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found.');
  }

  let uploadedImage = testimonial.image;

  // Handle new image upload
  if (file) {
    // Delete old image if it exists
    if (testimonial.image && testimonial.image.public_id) {
      await deleteImage(testimonial.image.public_id);
    }
    const uploadResult = await uploadImage(file.path, 'testimonials');
    uploadedImage = uploadResult;
  } 
  // Handle image deletion if requested specifically
  else if (updateData.deleteImage === 'true' || updateData.deleteImage === true) {
    if (testimonial.image && testimonial.image.public_id) {
      await deleteImage(testimonial.image.public_id);
    }
    uploadedImage = undefined;
  }

  // Update scalar fields
  const scalarFields = ['customerName', 'message', 'source', 'rating', 'isFeatured'];
  scalarFields.forEach(field => {
    if (updateData[field] !== undefined) {
      if (field === 'rating') {
        testimonial.rating = updateData.rating ? parseInt(updateData.rating, 10) : undefined;
      } else if (field === 'isFeatured') {
        testimonial.isFeatured = updateData.isFeatured === 'true' || updateData.isFeatured === true;
      } else {
        testimonial[field] = updateData[field];
      }
    }
  });

  testimonial.image = uploadedImage;

  await testimonial.save();
  return testimonial;
};

/**
 * Delete a testimonial
 */
export const deleteTestimonial = async (id) => {
  const testimonial = await Testimonial.findById(id);
  if (!testimonial) {
    throw new ApiError(404, 'Testimonial not found.');
  }

  // Delete attached image if exists
  if (testimonial.image && testimonial.image.public_id) {
    await deleteImage(testimonial.image.public_id);
  }

  await Testimonial.findByIdAndDelete(id);
  return true;
};
