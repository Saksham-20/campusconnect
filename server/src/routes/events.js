// server/src/routes/events.js
const express = require('express');
const { body } = require('express-validator');
const { authenticateToken, optionalAuth } = require('../middleware/auth');
const { requireRole } = require('../middleware/rbac');
const eventController = require('../controllers/eventController');

const router = express.Router();

/**
 * @swagger
 * /api/events:
 *   get:
 *     summary: Get all events
 *     tags: [Events]
 */
router.get('/', optionalAuth, eventController.getAllEvents);

/**
 * @swagger
 * /api/events:
 *   post:
 *     summary: Create a new event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', 
  authenticateToken, 
  requireRole('recruiter', 'tpo', 'admin'),
  [
    body('title').notEmpty().isLength({ min: 3, max: 255 }),
    body('description').notEmpty(),
    body('eventType').isIn(['campus_drive', 'info_session', 'workshop', 'seminar', 'job_fair', 'other']),
    body('startTime').isISO8601(),
    body('endTime').isISO8601(),
    body('maxParticipants').optional().isInt({ min: 1 })
  ],
  eventController.createEvent
);

/**
 * @swagger
 * /api/events/{id}:
 *   get:
 *     summary: Get event by ID
 *     tags: [Events]
 */
router.get('/:id', optionalAuth, eventController.getEventById);

/**
 * @swagger
 * /api/events/{id}:
 *   put:
 *     summary: Update event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', 
  authenticateToken, 
  requireRole('recruiter', 'tpo', 'admin'),
  eventController.updateEvent
);

/**
 * @swagger
 * /api/events/{id}/register:
 *   post:
 *     summary: Register for event
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/register', 
  authenticateToken, 
  eventController.registerForEvent
);

/**
 * @swagger
 * /api/events/{id}/cancel:
 *   post:
 *     summary: Cancel event registration
 *     tags: [Events]
 *     security:
 *       - bearerAuth: []
 */
router.post('/:id/cancel', 
  authenticateToken, 
  eventController.cancelEventRegistration
);

module.exports = router;