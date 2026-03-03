/**
 * AI NUSANTARA - Waitlist API
 * Minimal backend for landing page waitlist functionality
 */

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const waitlistRoutes = require('./routes/waitlist');

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet({
  contentSecurityPolicy: false // Disable for simplicity in development
}));

// CORS configuration
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:8000', 'http://localhost:3000'],
  credentials: true
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    error: 'Too many requests from this IP, please try again later.'
  }
});

app.use('/api/', limiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'AI NUSANTARA Waitlist API',
    version: '1.0.0'
  });
});

// Routes
app.use('/api/waitlist', waitlistRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.path
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);

  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    status: err.status || 500
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║   🚀 AI NUSANTARA Waitlist API                        ║
║                                                       ║
║   Server running on port ${PORT}                        ║
║   Environment: ${process.env.NODE_ENV || 'development'}                            ║
║   Time: ${new Date().toLocaleString('id-ID')}        ║
║                                                       ║
║   Endpoints:                                          ║
║   • GET  /health                                      ║
║   • POST /api/waitlist (add email)                    ║
║   • GET  /api/waitlist/stats                          ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
