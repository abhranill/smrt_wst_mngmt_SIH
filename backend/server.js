const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const fs = require('fs');

// Load environment variables
dotenv.config();

const { initDatabase } = require('./config/database');
const { seedDatabase, createSampleImages } = require('./utils/seedData');
const errorHandler = require('./middleware/errorHandler');

// Route imports
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');
const aiRoutes = require('./routes/aiRoutes');
const workerRoutes = require('./routes/workerRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const HOST = '0.0.0.0'; // Important: bind to 0.0.0.0 for preview proxy compatibility

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static uploads folder
const uploadsPath = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsPath)) {
  fs.mkdirSync(uploadsPath, { recursive: true });
}
app.use('/uploads', express.static(uploadsPath));

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    system: 'CleanCity 360 - Smart Waste Reporting & Management System',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Seed API endpoint for Hackathon demo resets
app.post('/api/admin/reseed', async (req, res, next) => {
  try {
    await seedDatabase(true);
    res.json({ success: true, message: 'Database successfully reseeded with fresh demo records.' });
  } catch (err) {
    next(err);
  }
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/workers', workerRoutes);
app.use('/api/analytics', analyticsRoutes);

// Static frontend serving (for production & unified preview on port 5000)
const frontendDistPath = path.join(__dirname, '../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req, res, next) => {
    // If request starts with /api or /uploads, pass through
    if (req.path.startsWith('/api') || req.path.startsWith('/uploads')) {
      return next();
    }
    if (req.method === 'GET') {
      return res.sendFile(path.join(frontendDistPath, 'index.html'));
    }
    next();
  });
}

// Error handling middleware
app.use(errorHandler);

// Startup sequence
const startServer = async () => {
  try {
    // 1. Initialize SQLite tables
    await initDatabase();

    // 2. Seed initial demo data
    createSampleImages();
    await seedDatabase(false);

    // 3. Start listening on 0.0.0.0
    app.listen(PORT, HOST, () => {
      console.log('====================================================');
      console.log(`🚀 CleanCity 360 Backend running on http://${HOST}:${PORT}`);
      console.log(`📡 Healthcheck available at: http://${HOST}:${PORT}/api/health`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('====================================================');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
