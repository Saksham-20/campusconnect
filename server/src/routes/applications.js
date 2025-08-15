// server/src/routes/applications.js
const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const applicationController = require('../controllers/applicationController');

const router = express.Router();

/**
 * @swagger
 * /api/applications:
 *   get:
 *     summary: Get applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', authenticateToken, applicationController.getApplications);

/**
 * @swagger
 * /api/applications:
 *   post:
 *     summary: Submit job application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', 
  authenticateToken, 
  requireRole('student'),
  [
    body('jobId').isInt(),
    body('coverLetter').optional().isLength({ max: 2000 }),
    body('resumeUrl').optional().isURL()
  ],
  applicationController.submitApplication
);

/**
 * @swagger
 * /api/applications/stats:
 *   get:
 *     summary: Get application statistics
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
// Move stats route BEFORE the :id route to prevent "stats" being interpreted as an ID
router.get('/stats', authenticateToken, applicationController.getApplicationStats);

/**
 * @swagger
 * /api/applications/bulk/update:
 *   patch:
 *     summary: Bulk update applications
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/bulk/update', 
  authenticateToken, 
  requireRole('recruiter', 'admin'),
  applicationController.bulkUpdateApplications
);

/**
 * @swagger
 * /api/applications/job/{jobId}:
 *   get:
 *     summary: Get applications for a job
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.get('/job/:jobId', 
  authenticateToken, 
  requireRole('recruiter', 'tpo', 'admin'),
  applicationController.getApplicationsByJob
);

/**
 * @swagger
 * /api/applications/{id}:
 *   get:
 *     summary: Get application by ID
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
// Move this route AFTER specific routes to prevent conflicts
router.get('/:id', authenticateToken, applicationController.getApplicationById);

/**
 * @swagger
 * /api/applications/{id}/status:
 *   patch:
 *     summary: Update application status
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/status', 
  authenticateToken, 
  requireRole('recruiter', 'tpo', 'admin'),
  applicationController.updateApplicationStatus
);

/**
 * @swagger
 * /api/applications/{id}/withdraw:
 *   patch:
 *     summary: Withdraw application
 *     tags: [Applications]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/withdraw', 
  authenticateToken, 
  requireRole('student'),
  applicationController.withdrawApplication
);

module.exports = router;