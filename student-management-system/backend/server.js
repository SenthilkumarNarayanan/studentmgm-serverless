const app = require('./app');  // This already has your routes and CORS config
const connectDB = require('./config/db');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Connect to database
connectDB();

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 5000;

// Make sure CORS is applied before starting
console.log('Starting server with CORS enabled for origins:', [
  'https://studentmgm.netlify.app/',
  'http://localhost:4200',
  'http://localhost:3000'
]);

app.listen(PORT, () => {
  console.log('====================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log('====================================');
});