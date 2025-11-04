const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { validateRegistration, handleValidationErrors } = require('../middleware/validation.middleware');

// Public registration endpoint
router.post('/register', 
    validateRegistration, 
    handleValidationErrors, 
    memberController.registerMember
);

// Health check (public)
router.get('/health', (req, res) => {
    res.json({
        success: true,
        message: 'Public API is running',
        timestamp: new Date().toISOString()
    });
});

module.exports = router;