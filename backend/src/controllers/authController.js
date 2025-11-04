const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const logger = require('../utils/logger');

// Generate JWT token
const generateToken = (userId, role) => {
    return jwt.sign(
        { userId, role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
};

// Admin login
exports.login = async (req, res, next) => {
    try {
        const { username, password } = req.body;
        
        // Development mode - hardcoded admin credentials
        // TODO: Remove this when database is set up
        const devAdminUsername = 'admin';
        const devAdminPassword = 'admin123';
        
        if (username === devAdminUsername && password === devAdminPassword) {
            const token = generateToken(1, 'admin');
            
            logger.info(`Development admin logged in: ${username}`);
            
            return res.json({
                success: true,
                message: 'Login successful (Development Mode)',
                token: token,
                user: {
                    id: 1,
                    username: 'admin',
                    email: 'admin@bgpnc.com',
                    full_name: 'BGP Administrator',
                    role: 'admin'
                }
            });
        }
        
        // Try database login if development credentials don't match
        try {
            // Find user by username or email
            const [users] = await pool.execute(
                'SELECT * FROM users WHERE (username = ? OR email = ?) AND is_active = true',
                [username, username]
            );
            
            if (users.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            
            const user = users[0];
            
            // Check password
            const isPasswordValid = await bcrypt.compare(password, user.password_hash);
            
            if (!isPasswordValid) {
                // Log failed attempt
                await pool.execute(
                    `INSERT INTO activity_logs (action, entity_type, entity_id, details, ip_address) 
                     VALUES (?, ?, ?, ?, ?)`,
                    [
                        'login_failed',
                        'user',
                        user.id,
                        JSON.stringify({ username }),
                        req.ip
                    ]
                );
                
                return res.status(401).json({
                    success: false,
                    message: 'Invalid credentials'
                });
            }
            
            // Generate token
            const token = generateToken(user.id, user.role);
            
            // Update last login
            await pool.execute(
                'UPDATE users SET last_login = CURRENT_TIMESTAMP WHERE id = ?',
                [user.id]
            );
            
            // Log successful login
            await pool.execute(
                `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, details, ip_address) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    user.id,
                    'login_success',
                    'user',
                    user.id,
                    JSON.stringify({ username: user.username }),
                    req.ip
                ]
            );
            
            logger.info(`User logged in: ${user.username} (ID: ${user.id})`);
            
            res.json({
                success: true,
                message: 'Login successful',
                token: token,
                user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    full_name: user.full_name,
                    role: user.role
                }
            });
        } catch (dbError) {
            // Database connection failed - fallback to development mode only
            logger.warn('Database not available, using development mode only');
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials. Try: username=admin, password=admin123'
            });
        }
    } catch (error) {
        logger.error('Login error:', error);
        next(error);
    }
};

// Logout (mainly for logging purposes)
exports.logout = async (req, res, next) => {
    try {
        // Log logout activity
        if (req.user) {
            await pool.execute(
                `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, ip_address) 
                 VALUES (?, ?, ?, ?, ?)`,
                [
                    req.user.id,
                    'logout',
                    'user',
                    req.user.id,
                    req.ip
                ]
            );
        }
        
        res.json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        logger.error('Logout error:', error);
        next(error);
    }
};

// Refresh token
exports.refreshToken = async (req, res, next) => {
    try {
        const { token } = req.body;
        
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token required'
            });
        }
        
        // Verify existing token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Check if user still exists and is active
        const [users] = await pool.execute(
            'SELECT id, role, is_active FROM users WHERE id = ? AND is_active = true',
            [decoded.userId]
        );
        
        if (users.length === 0) {
            return res.status(401).json({
                success: false,
                message: 'User not found or inactive'
            });
        }
        
        // Generate new token
        const newToken = generateToken(users[0].id, users[0].role);
        
        res.json({
            success: true,
            token: newToken
        });
    } catch (error) {
        if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token'
            });
        }
        logger.error('Token refresh error:', error);
        next(error);
    }
};

// Change password
exports.changePassword = async (req, res, next) => {
    try {
        const { currentPassword, newPassword } = req.body;
        const userId = req.user.id;
        
        // Validate new password
        if (newPassword.length < 8) {
            return res.status(400).json({
                success: false,
                message: 'New password must be at least 8 characters long'
            });
        }
        
        // Get user's current password hash
        const [users] = await pool.execute(
            'SELECT password_hash FROM users WHERE id = ?',
            [userId]
        );
        
        if (users.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        // Verify current password
        const isPasswordValid = await bcrypt.compare(currentPassword, users[0].password_hash);
        
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }
        
        // Hash new password
        const newPasswordHash = await bcrypt.hash(newPassword, 10);
        
        // Update password
        await pool.execute(
            'UPDATE users SET password_hash = ? WHERE id = ?',
            [newPasswordHash, userId]
        );
        
        // Log password change
        await pool.execute(
            `INSERT INTO activity_logs (user_id, action, entity_type, entity_id, ip_address) 
             VALUES (?, ?, ?, ?, ?)`,
            [
                userId,
                'password_changed',
                'user',
                userId,
                req.ip
            ]
        );
        
        logger.info(`Password changed for user ID: ${userId}`);
        
        res.json({
            success: true,
            message: 'Password changed successfully'
        });
    } catch (error) {
        logger.error('Change password error:', error);
        next(error);
    }
};

// Create initial admin user (run once during setup)
exports.createInitialAdmin = async (req, res, next) => {
    try {
        // Check if any admin users exist
        const [admins] = await pool.execute(
            'SELECT COUNT(*) as count FROM users WHERE role = ?',
            ['admin']
        );
        
        if (admins[0].count > 0) {
            return res.status(400).json({
                success: false,
                message: 'Admin user already exists'
            });
        }
        
        // Create admin user with environment variables or defaults
        const username = process.env.ADMIN_USERNAME || 'admin';
        const email = process.env.ADMIN_EMAIL || 'admin@bgpnc.com';
        const password = process.env.ADMIN_PASSWORD || 'ChangeMeNow!';
        
        // Hash password
        const passwordHash = await bcrypt.hash(password, 10);
        
        // Insert admin user
        const [result] = await pool.execute(
            `INSERT INTO users (username, email, password_hash, full_name, role, is_active) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [username, email, passwordHash, 'System Administrator', 'admin', true]
        );
        
        logger.info(`Initial admin user created: ${username}`);
        
        res.json({
            success: true,
            message: 'Initial admin user created successfully',
            credentials: {
                username: username,
                password: password,
                note: 'Please change this password immediately!'
            }
        });
    } catch (error) {
        logger.error('Create initial admin error:', error);
        next(error);
    }
};