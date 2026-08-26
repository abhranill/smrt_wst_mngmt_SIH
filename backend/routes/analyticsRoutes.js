const express = require('express');
const router = express.Router();
const { getOverviewStats } = require('../controllers/analyticsController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/overview', authenticateToken, getOverviewStats);

module.exports = router;
