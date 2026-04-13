const express = require('express');
const serverless = require('serverless-http');

const app = express();

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