const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

// Database configuration optimized for PlanetScale
const dbConfig = {
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'bgp_members',
    port: process.env.DATABASE_PORT || 3306,
    waitForConnections: true,
    connectionLimit: parseInt(process.env.DATABASE_CONNECTION_LIMIT || '10'),
    queueLimit: parseInt(process.env.DATABASE_QUEUE_LIMIT || '0'),
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
};

// Add SSL configuration for PlanetScale (or other cloud databases)
// PlanetScale requires SSL connection
if (process.env.DATABASE_SSL === 'true') {
    dbConfig.ssl = {
        rejectUnauthorized: true
    };
    logger.info('Database SSL enabled');
}

// Create connection pool
const pool = mysql.createPool(dbConfig);

// Test database connection (don't crash if fails)
pool.getConnection()
    .then(connection => {
        logger.info('Database connected successfully');
        connection.release();
    })
    .catch(err => {
        logger.error('Database connection failed:', err);
        console.error('WARNING: Database not available - some features will not work.');
        console.error('   To enable database features, please install and configure MySQL.');
    });

module.exports = pool;