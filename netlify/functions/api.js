const express = require('express');
const serverless = require('serverless-http');

const app = express();

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    message: 'API is working!',
    timestamp: new Date().toISOString()
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({ message: 'Test endpoint works!' });
});

// Admin registration endpoint
app.post('/api/v1/auth/admin/register', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Registration endpoint reached',
    receivedData: req.body 
  });
});

// Admin login endpoint
app.post('/api/v1/auth/admin/login', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Login endpoint reached',
    email: req.body.email
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    message: `Route not found: ${req.method} ${req.path}` 
  });
});

// Export the handler
exports.handler = serverless(app);
