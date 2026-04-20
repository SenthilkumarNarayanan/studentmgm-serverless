const express = require('express');
const serverless = require('serverless-http');
const auth= require('../../backend/middleware/auth');
const adminController = require('../../backend/controllers/adminController');
const authRoutes = require('../../backend/routes/authRoutes');
const adminRoutes = require('../../backend/routes/adminRoutes');
const studentRoutes = require('../../backend/routes/studentRoutes');
const notificationRoutes = require('../../backend/routes/notificationRoutes');
const leaveRoutes = require('../../backend/routes/leaveRoutes');
const authMiddleware = require('../../backend/middleware/authMiddleware');
const cors = require('cors');


const app = express();
app.use(cors());
app.use(express.json());

// ✅ TEST ROUTE (IMPORTANT)
app.get('/test', (req, res) => {
  res.json({ message: 'API working ✅' });
});

// ✅ LOGIN ROUTE
app.post('/v1/auth/admin/login', (req, res) => {
  res.json({
    success: true,
    message: 'Login works ✅',
    data: req.body
  });
});

// ❌ DO NOT use app.use('*')
// ✅ Use safe 404
app.use((req, res) => {
  res.status(404).json({
    message: `Route not found: ${req.path}`
  });
});

module.exports.handler = serverless(app);