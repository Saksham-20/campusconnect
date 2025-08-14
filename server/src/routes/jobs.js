// server/src/routes/jobs.js
const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const jobController = require('../controllers/jobController');

const router = express.Router();

/**
 * @swagger
 * /api/jobs:
 *   get:
 *     summary: Get all jobs
 *     tags: [Jobs]
 */
router.get('/', optionalAuth, jobController.getAllJobs);

/**
 * @swagger
 * /api/jobs:
 *   post:
 *     summary: Create a new job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', 
  authenticateToken, 
  requireRole('recruiter', 'tpo', 'admin'),
  [
    body('title').notEmpty().isLength({ min: 3, max: 255 }),
    body('description').notEmpty(),
    body('jobType').isIn(['internship', 'full_time', 'part_time']),
    body('applicationDeadline').optional().isISO8601()
  ],
  jobController.createJob
);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 */
router.get('/:id', optionalAuth, jobController.getJobById);

/**
 * @swagger
 * /api/jobs/{id}:
 *   put:
 *     summary: Update job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', 
  authenticateToken, 
  requireRole('recruiter', 'tpo', 'admin'),
  jobController.updateJob
);

/**
 * @swagger
 * /api/jobs/{id}/status:
 *   patch:
 *     summary: Update job status
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 */
router.patch('/:id/status', 
  authenticateToken, 
  requireRole('recruiter', 'tpo', 'admin'),
  jobController.toggleJobStatus
);

/**
 * @swagger
 * /api/jobs/recommended:
 *   get:
 *     summary: Get recommended jobs for student
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 */
router.get('/recommended', 
  authenticateToken, 
  requireRole('student'), 
  jobController.getRecommendedJobs
);

module.exports = router;
