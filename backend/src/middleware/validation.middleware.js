const { body, validationResult } = require('express-validator');

// Validation rules for member registration
exports.validateRegistration = [
    body('first_name')
        .trim()
        .notEmpty().withMessage('First name is required')
        .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('First name contains invalid characters'),
    
    body('last_name')
        .trim()
        .notEmpty().withMessage('Last name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters')
        .matches(/^[a-zA-Z\s'-]+$/).withMessage('Last name contains invalid characters'),
    
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('phone')
        .trim()
        .notEmpty().withMessage('Phone is required')
        .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone format')
        .isLength({ min: 10, max: 20 }).withMessage('Phone must be 10-20 characters'),
    
    body('date_of_birth')
        .notEmpty().withMessage('Date of birth is required')
        .isDate().withMessage('Invalid date format')
        .custom((value) => {
            const date = new Date(value);
            const today = new Date();
            const age = today.getFullYear() - date.getFullYear();
            if (age < 0 || age > 120) {
                throw new Error('Invalid date of birth');
            }
            return true;
        }),
    
    body('street_address')
        .trim()
        .notEmpty().withMessage('Street address is required')
        .isLength({ min: 5, max: 100 }).withMessage('Address must be 5-100 characters'),
    
    body('city')
        .trim()
        .notEmpty().withMessage('City is required')
        .isLength({ min: 2, max: 50 }).withMessage('City must be 2-50 characters'),
    
    body('state')
        .trim()
        .notEmpty().withMessage('State is required')
        .isLength({ min: 2, max: 2 }).withMessage('State must be 2 characters')
        .isAlpha().withMessage('State must contain only letters'),
    
    body('zip_code')
        .trim()
        .notEmpty().withMessage('ZIP code is required')
        .matches(/^\d{5}(-\d{4})?$/).withMessage('ZIP code must be 5 digits or 5+4 format'),
    
    // Optional fields
    body('marital_status')
        .optional()
        .isIn(['single', 'married', 'divorced', 'widowed'])
        .withMessage('Invalid marital status'),
    
    body('spouse_name')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Spouse name must be less than 100 characters'),
    
    body('baptism_date')
        .optional()
        .isDate().withMessage('Invalid baptism date format'),
    
    body('photo_consent')
        .optional()
        .isBoolean().withMessage('Photo consent must be true or false'),
    
    body('social_media_consent')
        .optional()
        .isBoolean().withMessage('Social media consent must be true or false'),
    
    body('email_consent')
        .optional()
        .isBoolean().withMessage('Email consent must be true or false'),
];

// Validation rules for login
exports.validateLogin = [
    body('username')
        .trim()
        .notEmpty().withMessage('Username is required'),
    
    body('password')
        .notEmpty().withMessage('Password is required')
];

// Validation rules for updating member
exports.validateMemberUpdate = [
    body('first_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('First name must be 2-50 characters'),
    
    body('last_name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 }).withMessage('Last name must be 2-50 characters'),
    
    body('email')
        .optional()
        .trim()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    
    body('phone')
        .optional()
        .trim()
        .matches(/^[\d\s\-\+\(\)]+$/).withMessage('Invalid phone format'),
    
    body('member_status')
        .optional()
        .isIn(['new_member', 'active', 'inactive'])
        .withMessage('Invalid member status')
];

// Middleware to check validation results
exports.handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            message: 'Validation failed',
            errors: errors.array() 
        });
    }
    next();
};