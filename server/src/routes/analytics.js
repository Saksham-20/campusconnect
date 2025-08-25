// server/src/routes/analytics.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

// Protected routes (require authentication)
router.use(authenticateToken);

// TPO Analytics Routes
router.get('/tpo', requireRole('tpo', 'admin'), analyticsController.getTPOAnalytics);
router.get('/tpo/export', requireRole('tpo', 'admin'), analyticsController.exportTPOAnalytics);
router.get('/tpo/students', requireRole('tpo', 'admin'), analyticsController.getStudentAnalytics);

module.exports = router;
