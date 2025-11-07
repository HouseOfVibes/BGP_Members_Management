const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
require('dotenv').config();

const authRoutes = require('./src/routes/auth.routes');
const memberRoutes = require('./src/routes/member.routes');
const adminRoutes = require('./src/routes/admin.routes');
const publicRoutes = require('./src/routes/public.routes');
const uploadRoutes = require('./src/routes/upload.routes');
const errorHandler = require('./src/middleware/errorHandler');
const logger = require('./src/utils/logger');

const app = express();

// Security middleware
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            scriptSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
        },
    },
}));

// CORS configuration
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
    optionsSuccessStatus: 200
}));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});

const registrationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 registration attempts
    message: 'Too many registration attempts, please try again later.'
});

app.use('/api/', limiter);
app.use('/api/public/register', registrationLimiter);

// Body parsing middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Logging middleware
app.use((req, res, next) => {
    logger.info(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        const pool = require('./src/config/database');
        await pool.execute('SELECT 1');
        
        res.json({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
            database: 'connected',
            environment: process.env.NODE_ENV
        });
    } catch (error) {
        logger.error('Health check failed:', error);
        res.status(503).json({
            status: 'unhealthy',
            timestamp: new Date().toISOString(),
            error: 'Database connection failed'
        });
    }
});

// Welcome page for root endpoint
app.get('/', (req, res) => {
    res.send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>BGP Members Management API</title>
            <style>
                body { 
                    font-family: Arial, sans-serif; 
                    max-width: 800px; 
                    margin: 50px auto; 
                    padding: 20px;
                    background: linear-gradient(135deg, #212121 0%, #1a1a1a 100%);
                    color: white;
                }
                .header { 
                    text-align: center; 
                    color: #9c8040; 
                    margin-bottom: 30px;
                }
                .section {
                    background: rgba(255,255,255,0.1);
                    padding: 20px;
                    border-radius: 8px;
                    margin: 20px 0;
                }
                .endpoint {
                    background: rgba(0,150,136,0.2);
                    padding: 10px;
                    border-radius: 4px;
                    margin: 10px 0;
                    font-family: monospace;
                }
                .status-good { color: #009688; }
                .status-warn { color: #ff9800; }
                a { color: #009688; text-decoration: none; }
                a:hover { text-decoration: underline; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Believers Gathering Place</h1>
                <h2>Member Management API</h2>
                <p>Backend Server is <span class="status-good">Running</span></p>
            </div>
            
            <div class="section">
                <h3>Status Check</h3>
                <div class="endpoint">
                    <a href="/health" target="_blank">GET /health</a> - Server health check
                </div>
                <div class="endpoint">
                    <a href="/api/public/health" target="_blank">GET /api/public/health</a> - Public API health
                </div>
            </div>
            
            <div class="section">
                <h3>Available API Endpoints</h3>
                <div class="endpoint">POST /api/public/register - Member registration (public)</div>
                <div class="endpoint">POST /api/auth/login - Admin login</div>
                <div class="endpoint">GET /api/members - List members (requires auth)</div>
                <div class="endpoint">GET /api/admin/dashboard - Dashboard stats (requires auth)</div>
            </div>
            
            <div class="section">
                <h3>⚠️ Database Status</h3>
                <p><span class="status-warn">Database connection not configured</span></p>
                <p>To enable database features:</p>
                <ol>
                    <li>Install MySQL 8.0+</li>
                    <li>Run: <code>mysql -u root -p < database/schema.sql</code></li>
                    <li>Update .env file with database credentials</li>
                    <li>Restart server</li>
                </ol>
            </div>
            
            <div class="section">
                <h3>Development Info</h3>
                <p><strong>Port:</strong> 5000</p>
                <p><strong>Environment:</strong> ${process.env.NODE_ENV || 'development'}</p>
                <p><strong>Version:</strong> 1.0.0</p>
                <p><strong>Timestamp:</strong> ${new Date().toISOString()}</p>
            </div>
        </body>
        </html>
    `);
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/upload', uploadRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: 'Endpoint not found'
    });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Health check available at http://localhost:${PORT}/health`);
});