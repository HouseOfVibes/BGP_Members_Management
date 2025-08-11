const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/auth.middleware');

// All admin routes require authentication and admin role
router.use(authenticate);
router.use(authorize('admin', 'staff'));

// Dashboard statistics
router.get('/dashboard', adminController.getDashboardStats);

// Analytics
router.get('/analytics', adminController.getAnalytics);

// Export data
router.get('/export/csv', adminController.exportToCSV);
router.get('/export/excel', adminController.exportToExcel);

// Activity logs
router.get('/activity-logs', authorize('admin'), adminController.getActivityLogs);

// Bulk operations
router.post('/bulk-update-status', authorize('admin'), adminController.bulkUpdateStatus);

module.exports = router;