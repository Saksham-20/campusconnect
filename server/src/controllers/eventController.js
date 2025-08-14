// server/src/controllers/eventController.js
const { Event, Organization, User, EventRegistration } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize');

class EventController {
  async createEvent(req, res, next) {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          error: 'Validation Error',
          details: errors.array()
        });
      }

      const eventData = {
        ...req.body,
        organizationId: req.user.organizationId,
        createdBy: req.user.id
      };

      const event = await Event.create(eventData);

      const eventWithDetails = await Event.findByPk(event.id, {
        include: [
          { model: Organization, as: 'organization' },
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] }
        ]
      });

      res.status(201).json({
        message: 'Event created successfully',
        event: eventWithDetails
      });
    } catch (error) {
      next(error);
    }
  }

  async getAllEvents(req, res, next) {
    try {
      const {
        page = 1,
        limit = 10,
        eventType,
        status = 'scheduled',
        organizationId,
        upcoming = false
      } = req.query;

      const offset = (page - 1) * limit;
      const whereClause = {};

      if (eventType) whereClause.eventType = eventType;
      if (status) whereClause.status = status;
      if (organizationId) whereClause.organizationId = organizationId;
      if (upcoming === 'true') {
        whereClause.startTime = { [Op.gte]: new Date() };
      }

      const { count, rows: events } = await Event.findAndCountAll({
        where: whereClause,
        include: [
          { 
            model: Organization, 
            as: 'organization',
            attributes: ['id', 'name', 'type', 'logoUrl']
          },
          {
            model: EventRegistration,
            as: 'registrations',
            attributes: ['id', 'status']
          }
        ],
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['startTime', 'ASC']]
      });

      const eventsWithCounts = events.map(event => {
        const eventData = event.toJSON();
        eventData.registrationCount = event.registrations ? event.registrations.length : 0;
        delete eventData.registrations;
        return eventData;
      });

      res.json({
        message: 'Events retrieved successfully',
        events: eventsWithCounts,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(count / limit),
          totalEvents: count,
          hasMore: offset + events.length < count
        }
      });
    } catch (error) {
      next(error);
    }
  }

  async getEventById(req, res, next) {
    try {
      const { id } = req.params;

      const event = await Event.findByPk(id, {
        include: [
          { model: Organization, as: 'organization' },
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] },
          {
            model: EventRegistration,
            as: 'registrations',
            include: [
              {
                model: User,
                as: 'user',
                attributes: ['id', 'firstName', 'lastName', 'email']
              }
            ]
          }
        ]
      });

      if (!event) {
        return res.status(404).json({
          error: 'Event Not Found',
          message: 'Event not found'
        });
      }

      // Check if current user is registered
      let userRegistration = null;
      if (req.user && event.registrations) {
        userRegistration = event.registrations.find(reg => reg.userId === req.user.id);
      }

      const eventData = event.toJSON();
      eventData.userRegistration = userRegistration;
      eventData.registrationCount = event.registrations ? event.registrations.length : 0;

      res.json({
        message: 'Event retrieved successfully',
        event: eventData
      });
    } catch (error) {
      next(error);
    }
  }

  async registerForEvent(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const event = await Event.findByPk(id);
      if (!event) {
        return res.status(404).json({
          error: 'Event Not Found',
          message: 'Event not found'
        });
      }

      // Check if event is still accepting registrations
      if (event.status !== 'scheduled') {
        return res.status(400).json({
          error: 'Registration Closed',
          message: 'This event is not accepting registrations'
        });
      }

      // Check registration deadline
      if (event.registrationDeadline && new Date() > new Date(event.registrationDeadline)) {
        return res.status(400).json({
          error: 'Registration Deadline Passed',
          message: 'Registration deadline has passed'
        });
      }

      // Check if user already registered
      const existingRegistration = await EventRegistration.findOne({
        where: { eventId: id, userId }
      });

      if (existingRegistration) {
        return res.status(409).json({
          error: 'Already Registered',
          message: 'You have already registered for this event'
        });
      }

      // Check max participants
      if (event.maxParticipants) {
        const currentRegistrations = await EventRegistration.count({
          where: { eventId: id, status: 'registered' }
        });

        if (currentRegistrations >= event.maxParticipants) {
          return res.status(400).json({
            error: 'Event Full',
            message: 'This event has reached maximum capacity'
          });
        }
      }

      const registration = await EventRegistration.create({
        eventId: id,
        userId,
        status: 'registered'
      });

      res.status(201).json({
        message: 'Successfully registered for event',
        registration
      });
    } catch (error) {
      next(error);
    }
  }

  async updateEvent(req, res, next) {
    try {
      const { id } = req.params;
      const event = await Event.findByPk(id);

      if (!event) {
        return res.status(404).json({
          error: 'Event Not Found',
          message: 'Event not found'
        });
      }

      // Check permissions
      if (req.user.role !== 'admin' && event.organizationId !== req.user.organizationId) {
        return res.status(403).json({
          error: 'Access Forbidden',
          message: 'You can only update events from your organization'
        });
      }

      await event.update(req.body);

      const updatedEvent = await Event.findByPk(id, {
        include: [
          { model: Organization, as: 'organization' },
          { model: User, as: 'creator', attributes: ['id', 'firstName', 'lastName'] }
        ]
      });

      res.json({
        message: 'Event updated successfully',
        event: updatedEvent
      });
    } catch (error) {
      next(error);
    }
  }

  async cancelEventRegistration(req, res, next) {
    try {
      const { id } = req.params;
      const userId = req.user.id;

      const registration = await EventRegistration.findOne({
        where: { eventId: id, userId }
      });

      if (!registration) {
        return res.status(404).json({
          error: 'Registration Not Found',
          message: 'You are not registered for this event'
        });
      }

      await registration.update({ status: 'cancelled' });

      res.json({
        message: 'Event registration cancelled successfully'
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new EventController();