const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { validateLogin, handleValidationErrors } = require('../middleware/validation.middleware');
const { authenticate } = require('../middleware/auth.middleware');

// Public routes
router.post('/login', validateLogin, handleValidationErrors, authController.login);
router.post('/refresh-token', authController.refreshToken);
router.post('/setup-admin', authController.createInitialAdmin); // Run once during initial setup

// Protected routes
router.post('/logout', authenticate, authController.logout);
router.post('/change-password', authenticate, authController.changePassword);

module.exports = router;