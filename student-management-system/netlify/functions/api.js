const express = require('express');
const serverless = require('serverless-http');

const app = express();
app.use(express.json());

// test route
app.get('/test', (req, res) => {
  res.json({ message: 'API working ✅' });
});

module.exports.handler = serverless(app);