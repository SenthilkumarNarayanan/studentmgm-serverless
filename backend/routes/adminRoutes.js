const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

// ✅ Check if controller functions exist
console.log('Admin Controller functions available:', Object.keys(adminController));

// Check each required function
const requiredFunctions = [
    'enrollStudent', 'blockStudent', 'unblockStudent', 'updateLeaveStatus',
    'getAllLeaves', 'createNotification', 'deleteNotification', 
    'getAllAdminNotifications', 'getAllStudents'
];

requiredFunctions.forEach(fn => {
    if (typeof adminController[fn] !== 'function') {
        console.error(`❌ Missing function: ${fn}`);
        throw new Error(`adminController.${fn} is not a function`);
    } else {
        console.log(`✅ Found function: ${fn}`);
    }
});

// Apply auth middleware
router.use(authMiddleware.protect);
router.use(authMiddleware.adminOnly);

// Routes
router.post('/student_enroll', adminController.enrollStudent);
router.put('/block/:studentId', adminController.blockStudent);
router.put('/unblock/:studentId', adminController.unblockStudent);
router.put('/leave/:leaveId', adminController.updateLeaveStatus);
router.get('/leaves', adminController.getAllLeaves);
router.post('/notification', adminController.createNotification);
router.delete('/notification/:id', adminController.deleteNotification);
router.get('/notification', adminController.getAllAdminNotifications);
router.get('/students', adminController.getAllStudents);

console.log('✅ Admin routes loaded successfully');
module.exports = router;