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
    body('title').notEmpty().trim().isLength({ min: 3, max: 255 }),
    body('description').notEmpty().trim(),
    body('jobType').isIn(['internship', 'full_time', 'part_time']),
    body('location').optional().trim(),
    body('salaryMin').optional().isInt({ min: 0 }),
    body('salaryMax').optional().isInt({ min: 0 }),
    body('experienceRequired').optional().isInt({ min: 0 }),
    body('totalPositions').optional().isInt({ min: 1 }),
    body('applicationDeadline').optional().isISO8601(),
    body('requirements').optional().trim(),
    body('skillsRequired').optional().isArray(),
    body('status').optional().isIn(['draft', 'active', 'closed', 'cancelled']),
    body('eligibilityCriteria').optional().isObject(),
    body('eligibilityCriteria.minCGPA').optional().isFloat({ min: 0, max: 10 }),
    body().custom((body) => {
      if (body.salaryMin && body.salaryMax && parseInt(body.salaryMin) > parseInt(body.salaryMax)) {
        throw new Error('Maximum salary must be greater than or equal to minimum salary');
      }
      return true;
    })
  ],
  jobController.createJob
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
// Move recommended route BEFORE :id route to prevent "recommended" being treated as an ID
router.get('/recommended', 
  authenticateToken, 
  requireRole('student'), 
  jobController.getRecommendedJobs
);

/**
 * @swagger
 * /api/jobs/stats:
 *   get:
 *     summary: Get job statistics
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 */
// Move stats route BEFORE :id route to prevent "stats" being interpreted as an ID
router.get('/stats', authenticateToken, jobController.getJobStats);

/**
 * @swagger
 * /api/jobs/{id}:
 *   get:
 *     summary: Get job by ID
 *     tags: [Jobs]
 */
// Move this route AFTER specific routes like /recommended and /stats
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
 * /api/jobs/{id}:
 *   delete:
 *     summary: Delete job
 *     tags: [Jobs]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', 
  authenticateToken, 
  requireRole('recruiter', 'tpo', 'admin'),
  jobController.deleteJob
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

module.exports = router;