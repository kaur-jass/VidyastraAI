const jwt = require('jsonwebtoken');

// 1. Authentication Middleware: Token verify karne ke liye
const protect = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: "Access Denied: No Token Provided" });
    }

    const token = authHeader.split(' ')[1];

    try {
        // Token verify karein
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // User info attach karein (decoded mein id aur role dono honge)
        req.user = decoded; 
        
        next();
    } catch (err) {
        return res.status(403).json({ message: "Invalid or Expired Token" });
    }
};

// 2. Authorization Middleware: Role check karne ke liye
const authorize = (allowedRoles = []) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({ 
                message: "Access Denied: You do not have permission to perform this action" 
            });
        }
        next();
    };
};

module.exports = { protect, authorize };