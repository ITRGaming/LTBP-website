import * as dashboardService from '../services/dashboardService.js';
import ApiResponse from '../utils/apiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

/**
 * @desc    Get dashboard statistics counts
 * @route   GET /api/dashboard
 * @access  Private (Admin only)
 */
export const getDashboardSummary = asyncHandler(async (req, res) => {
  const stats = await dashboardService.getDashboardStats();
  new ApiResponse(200, stats, 'Dashboard summary statistics retrieved successfully.').send(res);
});
