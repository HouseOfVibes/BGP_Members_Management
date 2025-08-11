const mysql = require('mysql2/promise');
const logger = require('../utils/logger');

// Create connection pool
const pool = mysql.createPool({
    host: process.env.DATABASE_HOST || 'localhost',
    user: process.env.DATABASE_USER || 'root',
    password: process.env.DATABASE_PASSWORD || '',
    database: process.env.DATABASE_NAME || 'bgp_members',
    port: process.env.DATABASE_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
    keepAliveInitialDelay: 0
});

// Test database connection (don't crash if fails)
pool.getConnection()
    .then(connection => {
        logger.info('✅ Database connected successfully');
        connection.release();
    })
    .catch(err => {
        logger.error('❌ Database connection failed:', err);
        console.error('⚠️  Database not available - some features will not work.');
        console.error('   To enable database features, please install and configure MySQL.');
    });

module.exports = pool;