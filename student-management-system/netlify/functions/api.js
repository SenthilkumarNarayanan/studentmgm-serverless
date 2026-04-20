const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');

// Routes
const authRoutes = require('../../backend/routes/authRoutes');
const adminRoutes = require('../../backend/routes/adminRoutes');
const studentRoutes = require('../../backend/routes/studentRoutes');
const notificationRoutes = require('../../backend/routes/notificationRoutes');
const leaveRoutes = require('../../backend/routes/leaveRoutes');

// Middleware (if needed)
const authMiddleware = require('../../backend/middleware/authMiddleware');
const adminController = require('../../backend/controllers/adminController');

const app = express();

// ✅ CORS Configuration (ONCE, before any routes)
const allowedOrigins = [
  'https://studentmgm.netlify.app',
  'http://localhost:4200',
  'http://localhost:8888',
  'http://localhost:3000',
];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked origin:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
}));

// Handle preflight requests
app.options('*', cors());

// Body parsing middleware
app.use(express.json());

// ✅ TEST ROUTE (Keep for health checks)
app.get('/test', (req, res) => {
  res.json({ 
    message: 'API working ✅',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// ✅ API Routes
app.use('/v1/auth', authRoutes);
app.use('/v1/admin', adminRoutes);
app.use('/v1/student', studentRoutes);
app.use('/v1/notifications', notificationRoutes);  // Add if needed
app.use('/v1/leaves', leaveRoutes);  // Add if needed

// ✅ 404 Handler - For unmatched routes (BEFORE error handler)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.path}`,
    availableRoutes: [
      'GET /test',
      'POST /v1/auth/*',
      'GET/POST/PUT/DELETE /v1/admin/*',
      'GET/POST/PUT/DELETE /v1/student/*',
      'GET/POST /v1/notifications/*',
      'GET/POST /v1/leaves/*'
    ]
  });
});

// ✅ Global Error Handler (ALWAYS LAST)
app.use((err, req, res, next) => {
  console.error('Error:', err.stack);
  
  // Handle CORS errors specifically
  if (err.message === 'Not allowed by CORS') {
    return res.status(403).json({
      success: false,
      error: 'CORS policy violation',
      message: err.message
    });
  }
  
  res.status(500).json({ 
    success: false,
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

module.exports.handler = serverless(app);