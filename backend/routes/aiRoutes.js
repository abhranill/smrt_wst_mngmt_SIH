const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const { analyzeImage, analyzePreset, getCategories } = require('../controllers/aiController');

// Upload image and get AI categorization
router.post('/analyze-image', upload.single('image'), analyzeImage);

// Analyze demo sample presets
router.post('/analyze-preset', analyzePreset);

// List supported categories with metadata
router.get('/categories', getCategories);

module.exports = router;
