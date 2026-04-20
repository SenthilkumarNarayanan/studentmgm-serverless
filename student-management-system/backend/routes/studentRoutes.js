const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all student routes
router.use(authMiddleware.protect);
router.use(authMiddleware.studentOnly);

// Student routes
router.put('/profile', studentController.updateStudentProfile);
router.post('/leave', studentController.applyLeave);
router.get('/leave', studentController.getMyLeaves);
router.get('/notifications', studentController.getAllNotifications);

module.exports = router;