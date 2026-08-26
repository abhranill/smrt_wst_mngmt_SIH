const express = require('express');
const router = express.Router();
const { getAllWorkers, getWorkerById } = require('../controllers/workerController');
const { authenticateToken, requireRole } = require('../middleware/authMiddleware');

router.get('/', authenticateToken, getAllWorkers);
router.get('/:id', authenticateToken, getWorkerById);

module.exports = router;
