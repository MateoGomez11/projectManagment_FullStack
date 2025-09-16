const asyncHandler = require('express-async-handler');
const analyticsService = require('../services/analyticsService');

//@desc Count by status
//@route GET /api/projects/analytics/status
//@access public
const getCountsByStatus = asyncHandler(async (req, res) => {
    const data = await analyticsService.countByStatus();
    res.status(200).json(data);
});

// GET /api/projects/analytics/months
const getCountsByMonth = asyncHandler(async (req, res) => {
    const data = await analyticsService.countByMonth();
    res.status(200).json(data);
});

module. exports = {getCountsByStatus, getCountsByMonth}