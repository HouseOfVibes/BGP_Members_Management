const nodemailer = require('nodemailer');
const logger = require('../utils/logger');

// Create transporter
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Welcome email template
const getWelcomeEmailTemplate = (firstName) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <style>
            body {
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
            }
            .header {
                background-color: #212121;
                color: #ffffff;
                padding: 20px;
                text-align: center;
            }
            .header h1 {
                color: #9c8040;
                margin: 0;
            }
            .content {
                background-color: #f5f5f5;
                padding: 30px;
                margin-top: 0;
            }
            .button {
                display: inline-block;
                padding: 12px 30px;
                background-color: #009688;
                color: #ffffff;
                text-decoration: none;
                border-radius: 4px;
                margin-top: 20px;
            }
            .footer {
                background-color: #1a1a1a;
                color: #cccccc;
                padding: 20px;
                text-align: center;
                font-size: 14px;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Believers Gathering Place</h1>
                <p>Welcome to Our Church Family!</p>
            </div>
            <div class="content">
                <h2>Dear ${firstName},</h2>
                <p>
                    We are thrilled to welcome you to Believers Gathering Place! 
                    Your registration has been successfully received, and we look forward 
                    to getting to know you better.
                </p>
                <p>
                    At BGP, we believe in building a strong community of faith where 
                    everyone is valued and loved. We're excited that you've chosen to 
                    join us on this spiritual journey.
                </p>
                <h3>What's Next?</h3>
                <ul>
                    <li>Join us for our Sunday service at 10:00 AM</li>
                    <li>Check out our weekly Bible study sessions</li>
                    <li>Connect with our ministry groups</li>
                    <li>Follow us on social media for updates and inspiration</li>
                </ul>
                <p>
                    If you have any questions or need assistance, please don't hesitate 
                    to reach out to our church office.
                </p>
                <a href="https://bgpnc.com" class="button">Visit Our Website</a>
            </div>
            <div class="footer">
                <p>Believers Gathering Place</p>
                <p>Wendell, NC</p>
                <p>Email: info@bgpnc.com | Phone: (919) 555-0123</p>
                <p>&copy; ${new Date().getFullYear()} Believers Gathering Place. All rights reserved.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Send welcome email
exports.sendWelcomeEmail = async (email, firstName) => {
    try {
        const mailOptions = {
            from: `"Believers Gathering Place" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to Believers Gathering Place!',
            html: getWelcomeEmailTemplate(firstName)
        };
        
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Welcome email sent to ${email}: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error(`Failed to send welcome email to ${email}:`, error);
        throw error;
    }
};

// Send password reset email
exports.sendPasswordResetEmail = async (email, resetToken) => {
    try {
        const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
        
        const mailOptions = {
            from: `"BGP Admin" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request',
            html: `
                <h2>Password Reset Request</h2>
                <p>You have requested to reset your password.</p>
                <p>Please click the link below to reset your password:</p>
                <a href="${resetUrl}">${resetUrl}</a>
                <p>This link will expire in 1 hour.</p>
                <p>If you did not request this, please ignore this email.</p>
            `
        };
        
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Password reset email sent to ${email}: ${info.messageId}`);
        return info;
    } catch (error) {
        logger.error(`Failed to send password reset email to ${email}:`, error);
        throw error;
    }
};

// Send bulk email
exports.sendBulkEmail = async (recipients, subject, content) => {
    const results = [];
    
    for (const recipient of recipients) {
        try {
            const mailOptions = {
                from: `"Believers Gathering Place" <${process.env.EMAIL_USER}>`,
                to: recipient.email,
                subject: subject,
                html: content.replace(/{{name}}/g, `${recipient.first_name} ${recipient.last_name}`)
            };
            
            const info = await transporter.sendMail(mailOptions);
            results.push({
                email: recipient.email,
                success: true,
                messageId: info.messageId
            });
        } catch (error) {
            logger.error(`Failed to send email to ${recipient.email}:`, error);
            results.push({
                email: recipient.email,
                success: false,
                error: error.message
            });
        }
    }
    
    return results;
};

// Verify email configuration
exports.verifyEmailConfiguration = async () => {
    try {
        await transporter.verify();
        logger.info('Email configuration verified successfully');
        return true;
    } catch (error) {
        logger.error('Email configuration verification failed:', error);
        return false;
    }
};