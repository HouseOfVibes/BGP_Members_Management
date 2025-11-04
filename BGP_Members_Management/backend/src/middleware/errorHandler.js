const logger = require('../utils/logger');

const errorHandler = (err, req, res, next) => {
    // Log error
    logger.error({
        message: err.message,
        stack: err.stack,
        url: req.originalUrl,
        method: req.method,
        ip: req.ip,
        user: req.user?.id
    });

    // Set default error values
    let status = err.status || 500;
    let message = err.message || 'Internal server error';
    let errors = err.errors || [];

    // Handle specific error types
    if (err.name === 'ValidationError') {
        status = 400;
        message = 'Validation error';
    }

    if (err.name === 'UnauthorizedError') {
        status = 401;
        message = 'Unauthorized access';
    }

    if (err.code === 'ER_DUP_ENTRY') {
        status = 409;
        message = 'Duplicate entry. This record already exists.';
    }

    if (err.code === 'ER_NO_REFERENCED_ROW_2') {
        status = 400;
        message = 'Referenced record not found';
    }

    // Send error response
    res.status(status).json({
        success: false,
        message: message,
        errors: errors,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};

module.exports = errorHandler;