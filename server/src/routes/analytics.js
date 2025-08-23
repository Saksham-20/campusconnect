// server/src/routes/analytics.js
const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const rbac = require('../middleware/rbac');

// Protected routes (require authentication)
router.use(auth);

// TPO Analytics Routes
router.get('/tpo', rbac(['tpo', 'admin']), analyticsController.getTPOAnalytics);
router.get('/tpo/export', rbac(['tpo', 'admin']), analyticsController.exportTPOAnalytics);
router.get('/tpo/students', rbac(['tpo', 'admin']), analyticsController.getStudentAnalytics);

module.exports = router;