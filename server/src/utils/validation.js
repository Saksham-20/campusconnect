// server/src/utils/validation.js
const { body, param, query } = require('express-validator');
const constants = require('./constants');

class ValidationUtils {
  // Custom validators
  static isValidRole(value) {
    return Object.values(constants.USER_ROLES).includes(value);
  }

  static isValidJobType(value) {
    return Object.values(constants.JOB_TYPES).includes(value);
  }

  static isValidJobStatus(value) {
    return Object.values(constants.JOB_STATUS).includes(value);
  }

  static isValidApplicationStatus(value) {
    return Object.values(constants.APPLICATION_STATUS).includes(value);
  }

  static isValidEventType(value) {
    return Object.values(constants.EVENT_TYPES).includes(value);
  }

  static isValidEventStatus(value) {
    return Object.values(constants.EVENT_STATUS).includes(value);
  }

  static isValidAssessmentType(value) {
    return Object.values(constants.ASSESSMENT_TYPES).includes(value);
  }

  static isValidNotificationType(value) {
    return Object.values(constants.NOTIFICATION_TYPES).includes(value);
  }

  static isValidCGPA(value) {
    const cgpa = parseFloat(value);
    return cgpa >= 0 && cgpa <= 10;
  }

  static isValidPercentage(value) {
    const percentage = parseFloat(value);
    return percentage >= 0 && percentage <= 100;
  }

  static isValidYearOfStudy(value) {
    const year = parseInt(value);
    return year >= 1 && year <= 6;
  }

  static isValidGraduationYear(value) {
    const year = parseInt(value);
    const currentYear = new Date().getFullYear();
    return year >= currentYear - 5 && year <= currentYear + 5;
  }

  static isValidFileType(mimetype, allowedTypes = []) {
    if (allowedTypes.length === 0) return true;
    return allowedTypes.includes(mimetype);
  }

  // Validation chains
  static validateEmail() {
    return body('email')
      .isEmail()
      .normalizeEmail()
      .withMessage('Please provide a valid email address');
  }

  static validatePassword() {
    return body('password')
      .isLength({ min: 8 })
      .withMessage('Password must be at least 8 characters long')
      .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
      .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number');
  }

  static validateName(fieldName) {
    return body(fieldName)
      .trim()
      .isLength({ min: 1, max: 100 })
      .withMessage(`${fieldName} must be between 1 and 100 characters`);
  }

  static validatePhone() {
    return body('phone')
      .optional()
      .matches(/^[\+]?[1-9][\d]{0,15}$/)
      .withMessage('Please provide a valid phone number');
  }

  static validateURL(fieldName) {
    return body(fieldName)
      .optional()
      .isURL()
      .withMessage(`${fieldName} must be a valid URL`);
  }

  static validateDate(fieldName) {
    return body(fieldName)
      .optional()
      .isISO8601()
      .withMessage(`${fieldName} must be a valid date`);
  }

  static validateId(paramName = 'id') {
    return param(paramName)
      .isInt({ min: 1 })
      .withMessage(`${paramName} must be a positive integer`);
  }

  static validatePositiveInteger(fieldName) {
    return body(fieldName)
      .optional()
      .isInt({ min: 0 })
      .withMessage(`${fieldName} must be a positive integer`);
  }

  static validateDecimal(fieldName, min = 0, max = null) {
    let validator = body(fieldName)
      .optional()
      .isDecimal({ decimal_digits: '0,2' });
    
    if (max !== null) {
      validator = validator.custom(value => {
        const num = parseFloat(value);
        if (num < min || num > max) {
          throw new Error(`${fieldName} must be between ${min} and ${max}`);
        }
        return true;
      });
    }
    
    return validator;
  }

  static validateArray(fieldName, minLength = 0, maxLength = null) {
    let validator = body(fieldName)
      .optional()
      .isArray({ min: minLength });
    
    if (maxLength !== null) {
      validator = validator.isArray({ max: maxLength });
    }
    
    return validator.withMessage(`${fieldName} must be an array`);
  }

  static validateEnum(fieldName, allowedValues) {
    return body(fieldName)
      .isIn(allowedValues)
      .withMessage(`${fieldName} must be one of: ${allowedValues.join(', ')}`);
  }

  static validatePaginationQuery() {
    return [
      query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
      query('limit')
        .optional()
        .isInt({ min: 1, max: constants.MAX_PAGE_SIZE })
        .withMessage(`Limit must be between 1 and ${constants.MAX_PAGE_SIZE}`)
    ];
  }

  static validateSortQuery(allowedFields = []) {
    return [
      query('sortBy')
        .optional()
        .custom(value => {
          if (allowedFields.length > 0 && !allowedFields.includes(value)) {
            throw new Error(`sortBy must be one of: ${allowedFields.join(', ')}`);
          }
          return true;
        }),
      query('sortOrder')
        .optional()
        .isIn(['asc', 'desc'])
        .withMessage('sortOrder must be either asc or desc')
    ];
  }

  static validateSearchQuery() {
    return query('search')
      .optional()
      .trim()
      .isLength({ min: 2, max: 100 })
      .withMessage('Search query must be between 2 and 100 characters');
  }

  // Conditional validation
  static validateConditional(fieldName, condition, validationChain) {
    return body(fieldName).custom((value, { req }) => {
      if (condition(req)) {
        return validationChain.run(req);
      }
      return true;
    });
  }

  // File validation
  static validateFileUpload(fieldName, allowedTypes = [], maxSize = constants.MAX_FILE_SIZE) {
    return body(fieldName).custom((value, { req }) => {
      const file = req.file;
      
      if (!file) {
        throw new Error('File is required');
      }

      if (allowedTypes.length > 0 && !allowedTypes.includes(file.mimetype)) {
        throw new Error(`File type must be one of: ${allowedTypes.join(', ')}`);
      }

      if (file.size > maxSize) {
        throw new Error(`File size must not exceed ${maxSize / (1024 * 1024)}MB`);
      }

      return true;
    });
  }

  // Cross-field validation
  static validatePasswordConfirmation() {
    return body('confirmPassword').custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Password confirmation does not match password');
      }
      return true;
    });
  }

  static validateDateRange(startField, endField) {
    return body(endField).custom((value, { req }) => {
      const startDate = new Date(req.body[startField]);
      const endDate = new Date(value);
      
      if (endDate <= startDate) {
        throw new Error(`${endField} must be after ${startField}`);
      }
      
      return true;
    });
  }

  // Custom validation for specific business rules
  static validateApplicationDeadline() {
    return body('applicationDeadline').custom(value => {
      const deadline = new Date(value);
      const now = new Date();
      
      if (deadline <= now) {
        throw new Error('Application deadline must be in the future');
      }
      
      return true;
    });
  }

  static validateEventTiming() {
    return [
      body('startTime').isISO8601().withMessage('Start time must be a valid date'),
      body('endTime')
        .isISO8601()
        .withMessage('End time must be a valid date')
        .custom((value, { req }) => {
          const startTime = new Date(req.body.startTime);
          const endTime = new Date(value);
          
          if (endTime <= startTime) {
            throw new Error('End time must be after start time');
          }
          
          const duration = endTime - startTime;
          const maxDuration = 24 * 60 * 60 * 1000; // 24 hours
          
          if (duration > maxDuration) {
            throw new Error('Event duration cannot exceed 24 hours');
          }
          
          return true;
        })
    ];
  }

  static validateSalaryRange() {
    return body('salaryMax').custom((value, { req }) => {
      const minSalary = parseInt(req.body.salaryMin);
      const maxSalary = parseInt(value);
      
      if (maxSalary && minSalary && maxSalary < minSalary) {
        throw new Error('Maximum salary must be greater than minimum salary');
      }
      
      return true;
    });
  }
}

module.exports = ValidationUtils;