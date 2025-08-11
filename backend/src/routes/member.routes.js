const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');
const { authenticate, authorize } = require('../middleware/auth.middleware');
const { validateMemberUpdate, handleValidationErrors } = require('../middleware/validation.middleware');

// All member routes require authentication
router.use(authenticate);

// Get all members (staff and admin)
router.get('/', authorize('admin', 'staff', 'viewer'), memberController.getAllMembers);

// Get single member
router.get('/:id', authorize('admin', 'staff', 'viewer'), memberController.getMemberById);

// Update member (admin and staff only)
router.put('/:id', 
    authorize('admin', 'staff'), 
    validateMemberUpdate, 
    handleValidationErrors, 
    memberController.updateMember
);

// Update member status
router.patch('/:id/status', 
    authorize('admin', 'staff'), 
    memberController.updateMemberStatus
);

// Delete member (admin only)
router.delete('/:id', authorize('admin'), memberController.deleteMember);

module.exports = router;