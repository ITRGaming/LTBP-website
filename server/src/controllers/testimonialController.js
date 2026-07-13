import * as testimonialService from '../services/testimonialService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get all testimonials (featured or sorted)
 * @route   GET /api/testimonials
 * @access  Public
 */
export const getTestimonials = asyncHandler(async (req, res) => {
  const testimonials = await testimonialService.getAllTestimonials(req.query);
  new ApiResponse(200, testimonials, 'Testimonials retrieved successfully.').send(res);
});

/**
 * @desc    Create a new testimonial
 * @route   POST /api/testimonials
 * @access  Private (Admin only) or Public (depending on business workflow, prompt requests it as GET public, write APIs protected. We'll protect write API but support optional uploads)
 */
export const createTestimonial = asyncHandler(async (req, res) => {
  // req.file is populated by multer upload.single('image')
  const file = req.file || null;
  const testimonial = await testimonialService.createTestimonial(req.body, file);
  new ApiResponse(201, testimonial, 'Testimonial created successfully.').send(res);
});

/**
 * @desc    Update a testimonial
 * @route   PUT /api/testimonials/:id
 * @access  Private (Admin only)
 */
export const updateTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const file = req.file || null;
  const testimonial = await testimonialService.updateTestimonial(id, req.body, file);
  new ApiResponse(200, testimonial, 'Testimonial updated successfully.').send(res);
});

/**
 * @desc    Delete a testimonial
 * @route   DELETE /api/testimonials/:id
 * @access  Private (Admin only)
 */
export const deleteTestimonial = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await testimonialService.deleteTestimonial(id);
  new ApiResponse(200, null, 'Testimonial deleted successfully.').send(res);
});
