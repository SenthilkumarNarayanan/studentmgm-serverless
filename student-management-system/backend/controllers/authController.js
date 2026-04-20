const Admin = require('../models/AdminModel');
const Student = require('../models/StudentModel');
const jwt = require('jsonwebtoken');

// Generate JWT token
const generateToken = (id, role) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30m" });
};

// Admin Register
exports.registerAdmin = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const adminExists = await Admin.findOne({ email });
        if (adminExists) {
            return res.status(400).json({ message: "Admin already exists under this email" });
        }

        const admin = await Admin.create({ name, email, password });

        const token = generateToken(admin._id, "admin");

        const adminData = {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        };

        res.status(201).json({
            message: "Admin registered successfully",
            token,
            data: adminData
        });
    } catch (error) {
        console.error('Admin registration error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Admin Login
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const admin = await Admin.findOne({ email });

        if (!admin) {
            return res.status(400).json({ message: "Admin not found" });
        }

        const isMatch = await admin.comparePassword(password);

        if (!isMatch) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(admin._id, "admin");

        const adminData = {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role
        };

        res.json({
            success: true,
            message: "Login successful",
            token,
            data: adminData
        });
    } catch (error) {
        console.error('Admin login error:', error);
        res.status(500).json({ message: error.message });
    }
};

// Student Register
exports.registerStudent = async (req, res) => {
    try {
        console.log('Received registration request:', req.body);
        
        const { regNo, name, email, password, profile } = req.body;

        // Validate required fields
        if (!regNo) {
            return res.status(400).json({ message: "Registration number is required" });
        }
        
        if (!name) {
            return res.status(400).json({ message: "Name is required" });
        }
        
        if (!email) {
            return res.status(400).json({ message: "Email is required" });
        }
        
        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        // Find student by registration number
        const student = await Student.findOne({ regNo });
        console.log('Found student:', student ? student.regNo : 'Not found');

        if (!student) {
            return res.status(400).json({ message: "Invalid registration number. Please contact admin." });
        }

        // Check if student already registered (has password)
        if (student.password) {
            return res.status(400).json({ message: "Student already registered. Please login." });
        }

        // Update student information
        student.name = name;
        student.email = email;
        student.password = password;
        if (profile) {
            student.profile = {
                phone: profile.phone || student.profile?.phone || '',
                address: profile.address || student.profile?.address || ''
            };
        }
        
        await student.save();

        console.log('Student registered successfully:', student.regNo);
        res.status(201).json({
            success: true,
            message: "Student registered successfully"
        });
    } catch (error) {
        console.error('Student registration error:', error);
        res.status(500).json({ message: error.message });
    }
};
// Student Login
exports.loginStudent = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Email and password are required" });
        }

        const student = await Student.findOne({ email }).select('+password');
        console.log('Found student for login:', student);  
        if (!student) {
            return res.status(400).json({ message: "Student not found" });
        }

        if (student.isBlocked) {
            return res.status(403).json({ message: "Account is blocked. Please contact admin." });
        }

        const isMatch = await student.comparePassword(password);
        
        if (!isMatch) {
            console.log('Invalid password for student:', email,
                "Provided password:", password,
                "Stored hash:", student.password
            );

            return res.status(401).json({ message: "Invalid credentials" });
        }

        const studentData = {
            id: student.id,
            name: student.name,
            email: student.email,
            regNo: student.regNo,
            profile: student.profile
        };

        res.json({
            success: true,
            message: "Login successful",
            token: generateToken(student._id, "student"),
            studentData
        });
    } catch (error) {
        console.error('Student login error:', error);
        res.status(500).json({ message: error.message });
    }
};