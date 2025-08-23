// server/src/routes/users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');
const rbac = require('../middleware/rbac');

// Protected routes (require authentication)
router.use(auth);

// Profile routes (any authenticated user can access their own profile)
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);

// Admin-only routes for user management
router.get('/admin/all', rbac(['admin']), userController.getAllUsers);
router.get('/admin/stats', rbac(['admin']), userController.getUserStats);
router.get('/admin/:userId', rbac(['admin']), userController.getUserById);
router.put('/admin/:userId', rbac(['admin']), userController.updateUser);
router.delete('/admin/:userId', rbac(['admin']), userController.deleteUser);

// General user routes (with role-based access)
router.get('/all', rbac(['admin', 'tpo', 'recruiter']), userController.getAllUsers);
router.get('/:userId', userController.getUserById);

module.exports = router;