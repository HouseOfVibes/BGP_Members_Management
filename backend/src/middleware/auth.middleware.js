const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const logger = require('../utils/logger');

exports.authenticate = async (req, res, next) => {
    try {
        // Extract token from header
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        
        if (!token) {
            return res.status(401).json({ 
                success: false,
                message: 'Access denied. No token provided.' 
            });
        }
        
        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user still exists and is active
        const [users] = await pool.execute(
            'SELECT id, username, email, role, is_active FROM users WHERE id = ? AND is_active = true',
            [decoded.userId]
        );
        
        if (users.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: 'User not found or inactive' 
            });
        }
        
        // Attach user to request
        req.user = users[0];
        next();
    } catch (error) {
        if (error.name === 'JsonWebTokenError') {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid token' 
            });
        }
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ 
                success: false,
                message: 'Token expired' 
            });
        }
        
        logger.error('Authentication error:', error);
        return res.status(500).json({ 
            success: false,
            message: 'Authentication error' 
        });
    }
};

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ 
                success: false,
                message: 'Authentication required' 
            });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ 
                success: false,
                message: 'Insufficient permissions' 
            });
        }
        
        next();
    };
};