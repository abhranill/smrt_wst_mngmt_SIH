const path = require('path');
const fs = require('fs');
const { classifyWasteImage, WASTE_CATEGORIES, CATEGORY_METADATA } = require('../services/aiClassifierService');

// Analyze uploaded image
const analyzeImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file uploaded for analysis.'
      });
    }

    const filePath = req.file.path;
    const originalName = req.file.originalname;

    const result = await classifyWasteImage(filePath, originalName);

    // Return the relative URL of uploaded file so frontend can preview it
    const fileUrl = `/uploads/${path.basename(filePath)}`;

    res.json({
      success: true,
      imageUrl: fileUrl,
      analysis: result
    });
  } catch (error) {
    next(error);
  }
};

// Analyze sample preset image (for rapid hackathon demo)
const analyzePreset = async (req, res, next) => {
  try {
    const { presetType } = req.body; // 'plastic', 'organic', 'paper', 'glass', 'metal', 'mixed'

    const presetMap = {
      plastic: {
        category: 'Plastic',
        confidence: 0.91,
        filename: 'sample-plastic-bottles.jpg',
        cues: ['PET bottle contours', 'Polyethylene film reflection', 'Consumer beverage packaging']
      },
      organic: {
        category: 'Organic/Wet waste',
        confidence: 0.88,
        filename: 'sample-organic-vegetable.jpg',
        cues: ['Vegetable trimmings', 'Fruit peel biomass', 'Biodegradable moist kitchen residue']
      },
      paper: {
        category: 'Paper',
        confidence: 0.89,
        filename: 'sample-cardboard-boxes.jpg',
        cues: ['Corrugated carton folds', 'Unbleached kraft paper', 'Packaging shipping box']
      },
      glass: {
        category: 'Glass',
        confidence: 0.86,
        filename: 'sample-glass-bottles.jpg',
        cues: ['Vitreous reflection', 'Transparent beverage bottle', 'Rigid silicate profile']
      },
      metal: {
        category: 'Metal',
        confidence: 0.87,
        filename: 'sample-metal-cans.jpg',
        cues: ['Aluminum soda can silhouette', 'Metallic specular luster', 'Cylindrical alloy body']
      },
      mixed: {
        category: 'Mixed waste',
        confidence: 0.82,
        filename: 'sample-mixed-garbage.jpg',
        cues: ['Heterogeneous roadside pile', 'Unsegregated consumer trash', 'Mixed polymers & organic scraps']
      }
    };

    const choice = presetMap[presetType] || presetMap.plastic;
    const meta = CATEGORY_METADATA[choice.category] || CATEGORY_METADATA['Mixed waste'];

    res.json({
      success: true,
      imageUrl: `/uploads/${choice.filename}`,
      analysis: {
        category: choice.category,
        confidence: choice.confidence,
        confidencePercent: `${Math.round(choice.confidence * 100)}%`,
        detectedCues: choice.cues,
        suggestedBin: meta.binColor,
        handlingAdvice: meta.handlingAdvice,
        isRecyclable: meta.recyclable,
        isBiodegradable: meta.biodegradable,
        modelName: 'CleanCity Vision-Assist v1.4 (Demo Mode)',
        isPrototype: true,
        processingTimeMs: 210,
        disclaimer: 'Prototype AI feature for assisted triage. Please confirm or correct category before submitting.'
      }
    });
  } catch (error) {
    next(error);
  }
};

// Get all waste categories with metadata
const getCategories = (req, res) => {
  res.json({
    success: true,
    categories: WASTE_CATEGORIES,
    metadata: CATEGORY_METADATA
  });
};

module.exports = {
  analyzeImage,
  analyzePreset,
  getCategories
};
