const jwt = require('jsonwebtoken');

// Protect Route (Verify Token)
exports.protect = async (req, res, next) => {
    let token;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ message: "Not authorized, token not found" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Attach user info
        req.userId = decoded.id;
        req.userRole = decoded.role;

        console.log('Authenticated:', { userId: req.userId, role: req.userRole });

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ message: "Token invalid or expired" });
    }
};

// Admin only middleware
exports.adminOnly = (req, res, next) => {
    if (req.userRole !== "admin") {
        return res.status(403).json({ message: "Admin access only" });
    }
    next();
};

// Student only middleware
exports.studentOnly = (req, res, next) => {
    if (req.userRole !== "student") {
        return res.status(403).json({ message: "Student access only" });
    }
    next();
};