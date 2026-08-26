const express = require('express');
const router = express.Router();
const {
  createComplaint,
  getAllComplaints,
  getMyComplaints,
  getComplaintById,
  assignWorker,
  updateStatus,
  trackPublic
} = require('../controllers/complaintController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

// Public route: track complaint by ID (for citizens checking status without login)
router.get('/track/:id', trackPublic);

// Citizen routes (Authenticated)
router.post('/', authenticateToken, createComplaint);
router.get('/my-reports', authenticateToken, getMyComplaints);

// Admin or General Complaints list
router.get('/', authenticateToken, getAllComplaints);
router.get('/:id', authenticateToken, getComplaintById);

// Admin only actions
router.patch('/:id/assign', authenticateToken, requireRole('admin'), assignWorker);
router.patch('/:id/status', authenticateToken, requireRole('admin'), updateStatus);

module.exports = router;
