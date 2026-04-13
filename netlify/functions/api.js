const express = require('express');
const serverless = require('serverless-http');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import your routes
const authRoutes = require('../../backend/routes/authRoutes');
const adminRoutes = require('../../backend/routes/adminRoutes');
const studentRoutes = require('../../backend/routes/studentRoutes');

const app = express();

// Database connection with caching for serverless
let cachedDb = null;

async function connectToDatabase() {
  if (cachedDb && cachedDb.readyState === 1) {
    console.log('✅ Using cached database connection');
    return cachedDb;
  }
  
  console.log('🔄 Creating new database connection');
  
  try {
    cachedDb = await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Serverless optimizations
      bufferCommands: false,
      maxPoolSize: 1,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Database connected successfully');
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
      cachedDb = null;
    });
    
    mongoose.connection.on('disconnected', () => {
      console.log('⚠️ MongoDB disconnected');
      cachedDb = null;
    });
    
    return cachedDb;
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    throw error;
  }
}

// Make database connection available to all routes
app.use(async (req, res, next) => {
  try {
    // Don't wait for DB connection on OPTIONS requests
    if (req.method === 'OPTIONS') {
      return next();
    }
    
    // Connect to database and attach to request
    req.db = await connectToDatabase();
    next();
  } catch (error) {
    console.error('Database middleware error:', error);
    res.status(500).json({ 
      message: 'Database connection failed. Please try again.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// CORS configuration
const allowedOrigins = process.env.NODE_ENV === 'production'
  ? [
      'https://your-app.netlify.app',
      'https://your-custom-domain.com',
      process.env.FRONTEND_URL
    ].filter(Boolean)
  : ['http://localhost:4200', 'http://localhost:8888', 'http://localhost:3000'];

app.use(cors({
  origin: function(origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      callback(null, true);
    } else {
      console.warn(`CORS blocked origin: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['Authorization']
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`📝 ${req.method} ${req.path}`);
  next();
});

// Health check endpoint (doesn't need DB connection)
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    dbState: cachedDb ? 'connected' : 'disconnected',
    mongodbUri: process.env.MONGODB_URI ? 'configured' : 'missing'
  });
});

// ============================================
// MOUNT YOUR EXISTING ROUTES
// ============================================

// Auth routes (public)
app.use('/api/auth', authRoutes);

// Admin routes (protected by authMiddleware inside)
app.use('/api/admin', adminRoutes);

// Student routes (protected by authMiddleware inside)
app.use('/api/students', studentRoutes);

// 404 handler for undefined API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ 
    message: `API endpoint not found: ${req.method} ${req.path}` 
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Global error:', err.stack);
  
  // Handle specific error types
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }
  
  res.status(err.status || 500).json({ 
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Export the serverless handler
exports.handler = serverless(app);