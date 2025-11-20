const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');

/**
 * @swagger
 * /api/statistics/admin:
 *   get:
 *     summary: Get comprehensive admin statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Admin statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: object
 *                     organizations:
 *                       type: object
 *                     jobs:
 *                       type: object
 *                     applications:
 *                       type: object
 *                     placements:
 *                       type: object
 *                     recentActivity:
 *                       type: array
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin access required
 */
router.get('/admin', authenticateToken, requireRole('admin'), statisticsController.getAdminStats);

/**
 * @swagger
 * /api/statistics/tpo:
 *   get:
 *     summary: Get comprehensive TPO statistics
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: TPO statistics retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 stats:
 *                   type: object
 *                   properties:
 *                     students:
 *                       type: object
 *                     jobs:
 *                       type: object
 *                     applications:
 *                       type: object
 *                     events:
 *                       type: object
 *                     recentActivity:
 *                       type: array
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - TPO access required
 */
router.get('/tpo', authenticateToken, requireRole('tpo'), statisticsController.getTPOStats);

/**
 * @swagger
 * /api/statistics/dashboard:
 *   get:
 *     summary: Get dashboard overview statistics based on user role
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dashboard statistics retrieved successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin or TPO access required
 */
router.get('/dashboard', authenticateToken, requireRole('admin', 'tpo'), statisticsController.getDashboardOverview);

/**
 * @swagger
 * /api/statistics/analytics/advanced:
 *   get:
 *     summary: Get advanced analytics with time-series data
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/analytics/advanced', authenticateToken, requireRole('admin'), statisticsController.getAdvancedAnalytics);

/**
 * @swagger
 * /api/statistics/analytics/top-performers:
 *   get:
 *     summary: Get top performers (universities, companies, students)
 *     tags: [Statistics]
 *     security:
 *       - bearerAuth: []
 */
router.get('/analytics/top-performers', authenticateToken, requireRole('admin'), statisticsController.getTopPerformers);

module.exports = router;
