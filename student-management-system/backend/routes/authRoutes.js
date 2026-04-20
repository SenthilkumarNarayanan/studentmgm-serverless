const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Auth routes (no auth middleware needed)
router.post('/admin/register', authController.registerAdmin);
router.post('/admin/login', authController.loginAdmin);
router.post('/student/register', authController.registerStudent);
router.post('/student/login', authController.loginStudent);

module.exports = router;