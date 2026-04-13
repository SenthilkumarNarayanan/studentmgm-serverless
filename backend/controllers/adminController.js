console.log('=== Loading adminController ===');

const Leave = require('../models/LeaveModel');
const NotificationModel = require('../models/NotificationModel');
const Student = require('../models/StudentModel');
const sendEnrollmentEmail = require('../services/emailService');


// Enroll student - FIXED
exports.enrollStudent = async (req, res) => {
    try {
        const { name, email } = req.body;
        
        console.log('Enrollment request received:', { name, email });

        // Validate required fields
        if (!name || !email) {
            return res.status(400).json({ 
                message: "Name and email are required" 
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                message: "Please enter a valid email address" 
            });
        }

        // Check if student already exists
        const existingStudent = await Student.findOne({ email });
        if (existingStudent) {
            return res.status(400).json({ 
                message: "Student with this email already exists" 
            });
        }

        // Generate registration number
        const count = await Student.countDocuments();
        const RegNo = "SN1000" + (count + 1);
        
        // Create new student
        const student = await Student.create({ 
            name: name.trim(), 
            email: email.trim().toLowerCase(), 
            regNo: RegNo,
            isBlocked: false,
            profile: {} // Initialize empty profile
        });

        // In adminController.js, right after saving student
console.log('Student object being passed to email:', {
  name: student.name,
  email: student.email,
  regNo: student.regNo
});
        // Send enrollment email with credentials
      const emailResult = await sendEnrollmentEmail(student);
      console.log('Email result:', emailResult);
        
        res.status(201).json({
            success: true,
            message: "Student enrolled successfully. Login credentials have been sent to their email.",
            RegNo: student.regNo,
            student: {
                id: student._id,
                name: student.name,
                email: student.email,
                regNo: student.regNo
            }
        });

    } catch (error) {
        console.error('Error enrolling student:', error);
        res.status(500).json({ 
            message: error.message || "Failed to enroll student" 
        });
    }
};

// Block student
exports.blockStudent = async (req, res) => {
    try {
        const { studentId } = req.params;
        
        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        const student = await Student.findById(studentId);

        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        student.isBlocked = true;
        await student.save();
        
        res.json({
            success: true,
            message: "Student blocked successfully",
            name: student.name,
            regNo: student.regNo
        });
    } catch (error) {
        console.error('Error blocking student:', error);
        res.status(500).json({ message: error.message });
    }
};

// Unblock student
exports.unblockStudent = async (req, res) => {
    const { studentId } = req.params;
    try {
        if (!studentId) {
            return res.status(400).json({ message: "Student ID is required" });
        }

        const student = await Student.findById(studentId);
        
        if (!student) {
            return res.status(404).json({ message: "Student not found" });
        }

        student.isBlocked = false;
        await student.save();
        
        res.json({
            success: true,
            message: "Student unblocked successfully",
            regNo: student.regNo,
            name: student.name
        });
    } catch (error) {
        console.error('Error unblocking student:', error);
        res.status(500).json({ message: error.message });
    }
};

// Approve/Reject leave
exports.updateLeaveStatus = async (req, res) => {
    const { leaveId } = req.params;
    const { status } = req.body;
    
    try {
        if (!leaveId) {
            return res.status(400).json({ message: "Leave ID is required" });
        }

        if (!status || !["approved", "rejected"].includes(status)) {
            return res.status(400).json({ message: "Invalid status. Must be 'approved' or 'rejected'" });
        }

        const leave = await Leave.findById(leaveId);
        
        if (!leave) {
            return res.status(404).json({ message: "Leave not found" });
        }

        // Update using findByIdAndUpdate to avoid validation issues
        const updatedLeave = await Leave.findByIdAndUpdate(
            leaveId,
            { status: status },
            { new: true }
        ).populate('studentId', 'name email regNo');

        const studentName = updatedLeave.studentId ? updatedLeave.studentId.name : 'Student';

        res.json({
            success: true,
            message: `Leave ${status} for ${studentName}`,
            data: updatedLeave
        });
    } catch (error) {
        console.error('Error updating leave status:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all leaves
exports.getAllLeaves = async (req, res) => {
    try {
        const leaves = await Leave.find()
            .populate('studentId', 'name email regNo')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: leaves
        });
    } catch (error) {
        console.error('Error getting leaves:', error);
        res.status(500).json({ message: error.message });
    }
};

// Create notification
exports.createNotification = async (req, res) => {
    try {
        const { title, description, fileUrl } = req.body;

        if (!title || !description) {
            return res.status(400).json({ message: "Title and description are required" });
        }

        const notification = await NotificationModel.create({
            title,
            description,
            fileUrl: fileUrl || ''
        });

        res.status(201).json({
            success: true,
            message: 'Notification created successfully',
            data: notification
        });
    } catch (error) {
        console.error('Error creating notification:', error);
        res.status(500).json({ message: error.message });
    }
};

// Delete notification
exports.deleteNotification = async (req, res) => {
    try {
        const { id } = req.params;

        if (!id) {
            return res.status(400).json({ message: "Notification ID is required" });
        }

        const deleted = await NotificationModel.findByIdAndDelete(id);

        if (!deleted) {
            return res.status(404).json({ message: "Notification not found" });
        }

        res.json({
            success: true,
            message: "Notification deleted successfully"
        });
    } catch (error) {
        console.error('Error deleting notification:', error);
        res.status(500).json({ message: error.message });
    }
};

// Get all notifications for admin
exports.getAllAdminNotifications = async (req, res) => {
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

// Get all students
exports.getAllStudents = async (req, res) => {
    try {
        const students = await Student.find().select('-password');
        res.json({
            success: true,
            data: students
        });
    } catch (error) {
        console.error('Error getting students:', error);
        res.status(500).json({ message: error.message });
    }
};