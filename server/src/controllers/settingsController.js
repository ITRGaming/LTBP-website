import * as settingsService from '../services/settingsService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get global website settings
 * @route   GET /api/settings
 * @access  Public
 */
export const getSettings = asyncHandler(async (req, res) => {
  const settings = await settingsService.getGlobalSettings();
  new ApiResponse(200, settings, 'Global website settings retrieved successfully.').send(res);
});

/**
 * @desc    Update global website settings
 * @route   PUT /api/settings
 * @access  Private (Admin only)
 */
export const updateSettings = asyncHandler(async (req, res) => {
  // req.files is populated by multer upload.fields()
  const files = req.files || {};
  const settings = await settingsService.updateGlobalSettings(req.body, files);
  new ApiResponse(200, settings, 'Global website settings updated successfully.').send(res);
});
