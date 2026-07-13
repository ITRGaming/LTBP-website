import * as contactService from '../services/contactService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Submit a contact inquiry (Public API)
 * @route   POST /api/contact
 * @access  Public
 */
export const submitContactForm = asyncHandler(async (req, res) => {
  const message = await contactService.createContactMessage(req.body);
  new ApiResponse(201, message, 'Contact message submitted successfully. We will get back to you shortly.').send(res);
});

/**
 * @desc    Get all contact messages (Admin API)
 * @route   GET /api/contact
 * @access  Private (Admin only)
 */
export const getContactMessages = asyncHandler(async (req, res) => {
  const result = await contactService.getAllContactMessages(req.query);
  new ApiResponse(200, result, 'Contact messages retrieved successfully.').send(res);
});

/**
 * @desc    Get a single contact message (Admin API)
 * @route   GET /api/contact/:id
 * @access  Private (Admin only)
 */
export const getContactMessageById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const message = await contactService.getContactMessageById(id);
  new ApiResponse(200, message, 'Contact message details retrieved successfully.').send(res);
});

/**
 * @desc    Delete a contact message (Admin API)
 * @route   DELETE /api/contact/:id
 * @access  Private (Admin only)
 */
export const deleteContactMessage = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await contactService.deleteContactMessage(id);
  new ApiResponse(200, null, 'Contact message deleted successfully.').send(res);
});
