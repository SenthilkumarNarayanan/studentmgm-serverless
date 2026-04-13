const Student = require('../models/StudentModel');
const Leave = require('../models/LeaveModel');
const NotificationModel = require('../models/NotificationModel');

// Update student profile logic
exports.updateStudentProfile = async (req, res) => {
    try {
        const { phone, address } = req.body;

        const student = await Student.findById(req.userId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        if (!student.profile) {
            student.profile = {};
        }

        student.profile.phone = phone || student.profile.phone;
        student.profile.address = address || student.profile.address;

        await student.save();
        
        const studentData = {
            id: student.id,
            name: student.name,
            email: student.email,
            regNo: student.regNo,
            address: student.profile.address,
            phone: student.profile.phone
        };

        res.json({
            message: "Profile updated successfully",
            studentData
        });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Apply leave for student - FIXED
exports.applyLeave = async (req, res) => {
    const { reason, fromDate, toDate } = req.body;
    const studentId = req.userId;

    try {
        // Check if any required field is missing - FIXED condition
        if (!reason || !fromDate || !toDate) {
            return res.status(400).json({ message: "Missing required information. Please provide reason, fromDate, toDate" });
        }

        if (!studentId) {
            return res.status(401).json({ message: "User not authenticated" });
        }

        const leave = await Leave.create({
            studentId,
            reason,
            fromDate,
            toDate,
            status: 'pending'
        });

        res.status(201).json({
            success: true,
            message: "Leave applied successfully",
            data: leave
        });

    } catch (error) {
        console.error('Error applying leave:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get student all leaves
exports.getMyLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find({ studentId: req.userId }).sort({ createdAt: -1 });
        res.json({
            success: true,
            data: leaves
        });
    } catch (error) {
        console.error('Error getting leaves:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all notifications for student
exports.getAllNotifications = async (req, res) => {
    try {
        const notifications = await NotificationModel.find().sort({ createdAt: -1 });
        res.json({
            success: true,
            data: notifications
        });
    } catch (error) {
        console.error('Error getting notifications:', error);
        res.status(500).json({ message: error.message });
    }
};