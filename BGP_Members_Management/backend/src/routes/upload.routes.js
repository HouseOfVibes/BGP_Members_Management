const express = require('express');
const router = express.Router();
const upload = require('../config/upload');
const logger = require('../utils/logger');

// Upload profile photo
router.post('/photo', upload.single('photo'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Generate URL for the uploaded file
        const photoUrl = `/uploads/photos/${req.file.filename}`;

        logger.info(`Photo uploaded successfully: ${req.file.filename}`);

        res.json({
            success: true,
            message: 'Photo uploaded successfully',
            data: {
                filename: req.file.filename,
                url: photoUrl,
                size: req.file.size
            }
        });
    } catch (error) {
        logger.error('Photo upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to upload photo',
            error: error.message
        });
    }
});

// Error handling middleware for multer
router.use((error, req, res, next) => {
    if (error instanceof multer.MulterError) {
        if (error.code === 'LIMIT_FILE_SIZE') {
            return res.status(400).json({
                success: false,
                message: 'File size too large. Maximum size is 5MB.'
            });
        }
        return res.status(400).json({
            success: false,
            message: error.message
        });
    }
    next(error);
});

module.exports = router;
