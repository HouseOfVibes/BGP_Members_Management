const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * Pabbly Connect Webhook Endpoint
 * This endpoint receives data from Pabbly Connect after form submission
 * and email verification
 */

// POST /api/webhook/pabbly/registration
router.post('/pabbly/registration', async (req, res) => {
    try {
        logger.info('Received webhook from Pabbly Connect:', {
            body: req.body,
            headers: req.headers
        });

        // Extract data from Pabbly webhook
        const webhookData = req.body;

        // You can validate the webhook here (Pabbly sends verification tokens)
        // if (webhookData.verification_token !== process.env.PABBLY_WEBHOOK_TOKEN) {
        //     return res.status(401).json({ error: 'Invalid webhook token' });
        // }

        // Process the registration data
        // The exact structure depends on how you configure Pabbly
        const registrationData = {
            first_name: webhookData.first_name,
            last_name: webhookData.last_name,
            email: webhookData.email,
            email_verified: true, // Email is verified by Pabbly
            // ... other fields
        };

        // Store in database or process as needed
        logger.info('Processing verified registration from Pabbly:', registrationData);

        // Respond to Pabbly
        res.status(200).json({
            success: true,
            message: 'Webhook received and processed'
        });

    } catch (error) {
        logger.error('Pabbly webhook error:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to process webhook'
        });
    }
});

// GET endpoint for webhook verification (if Pabbly requires it)
router.get('/pabbly/registration', (req, res) => {
    res.status(200).json({
        message: 'Pabbly webhook endpoint is active',
        status: 'ready'
    });
});

module.exports = router;
