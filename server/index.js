const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const cron = require('node-cron');
require('dotenv').config();

const { initializeDatabase } = require('./database/db');
const { fetchAndCacheData } = require('./services/dataService');
const { setupRoutes } = require('./routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
});
app.use(limiter);

// Middleware
app.use(compression());
app.use(morgan('combined'));
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:3000', 'https://your-frontend.vercel.app'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Initialize database
initializeDatabase();

// Setup routes
setupRoutes(app);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// API info endpoint
app.get('/api/info', (req, res) => {
  res.json({
    name: 'MGNREGA Performance Tracker API',
    version: '1.0.0',
    description: 'Backend API for MGNREGA district performance tracking',
    endpoints: {
      districts: '/api/districts',
      performance: '/api/performance/:districtCode',
      summary: '/api/district/:districtCode/summary',
      compare: '/api/compare',
      stateSummary: '/api/state-summary',
      refresh: '/api/refresh-data'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Schedule data updates every 6 hours
cron.schedule('0 */6 * * *', async () => {
  console.log('Running scheduled data update...');
  try {
    await fetchAndCacheData();
    console.log('Data update completed successfully');
  } catch (error) {
    console.error('Scheduled data update failed:', error);
  }
});

// Initial data fetch on startup
fetchAndCacheData().catch(console.error);

app.listen(PORT, () => {
  console.log(`🚀 MGNREGA Backend API running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});
