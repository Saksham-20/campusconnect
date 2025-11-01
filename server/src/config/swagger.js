// server/src/config/swagger.js
const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EduMapping API',
      version: '1.0.0',
      description: 'A comprehensive campus recruitment platform API that connects students with recruiters and manages the entire placement process.',
      contact: {
        name: 'EduMapping Team',
        email: 'support@edumapping.com',
        url: 'https://edumapping.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.edumapping.com' 
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            email: { type: 'string', format: 'email', example: 'user@example.com' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Doe' },
            role: { 
              type: 'string', 
              enum: ['student', 'recruiter', 'tpo', 'admin'],
              example: 'student'
            },
            phone: { type: 'string', example: '+1234567890' },
            isActive: { type: 'boolean', example: true },
            isVerified: { type: 'boolean', example: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        },
        Organization: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            name: { type: 'string', example: 'Tech University' },
            type: { 
              type: 'string', 
              enum: ['university', 'company'],
              example: 'university'
            },
            domain: { type: 'string', example: 'techuniversity.edu' },
            website: { type: 'string', example: 'https://techuniversity.edu' },
            isVerified: { type: 'boolean', example: true }
          }
        },
        Job: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Software Engineer' },
            description: { type: 'string', example: 'We are looking for a talented developer...' },
            jobType: { 
              type: 'string', 
              enum: ['internship', 'full_time', 'part_time'],
              example: 'full_time'
            },
            location: { type: 'string', example: 'San Francisco, CA' },
            salaryMin: { type: 'integer', example: 80000 },
            salaryMax: { type: 'integer', example: 120000 },
            skillsRequired: { 
              type: 'array', 
              items: { type: 'string' },
              example: ['JavaScript', 'React', 'Node.js']
            },
            status: { 
              type: 'string', 
              enum: ['draft', 'active', 'closed', 'cancelled'],
              example: 'active'
            },
            applicationDeadline: { type: 'string', format: 'date' },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Application: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            jobId: { type: 'integer', example: 1 },
            studentId: { type: 'integer', example: 5 },
            coverLetter: { type: 'string', example: 'I am excited to apply...' },
            resumeUrl: { type: 'string', example: 'https://example.com/resume.pdf' },
            status: { 
              type: 'string', 
              enum: ['applied', 'screening', 'shortlisted', 'interviewed', 'selected', 'rejected', 'withdrawn'],
              example: 'applied'
            },
            appliedAt: { type: 'string', format: 'date-time' },
            feedback: { type: 'string', example: 'Great candidate...' }
          }
        },
        Event: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Campus Recruitment Drive' },
            description: { type: 'string', example: 'Join us for our annual recruitment...' },
            eventType: { 
              type: 'string', 
              enum: ['campus_drive', 'info_session', 'workshop', 'seminar', 'job_fair', 'other'],
              example: 'campus_drive'
            },
            startTime: { type: 'string', format: 'date-time' },
            endTime: { type: 'string', format: 'date-time' },
            location: { type: 'string', example: 'Main Auditorium' },
            maxParticipants: { type: 'integer', example: 100 },
            status: { 
              type: 'string', 
              enum: ['draft', 'scheduled', 'ongoing', 'completed', 'cancelled'],
              example: 'scheduled'
            }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            id: { type: 'integer', example: 1 },
            title: { type: 'string', example: 'Application Update' },
            message: { type: 'string', example: 'Your application has been shortlisted' },
            notificationType: { 
              type: 'string', 
              enum: ['application_update', 'job_alert', 'event_reminder', 'system_alert', 'general'],
              example: 'application_update'
            },
            isRead: { type: 'boolean', example: false },
            priority: { 
              type: 'string', 
              enum: ['low', 'medium', 'high', 'urgent'],
              example: 'medium'
            },
            createdAt: { type: 'string', format: 'date-time' }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: { type: 'string', example: 'Validation Error' },
            message: { type: 'string', example: 'The provided data is invalid' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string', example: 'email' },
                  message: { type: 'string', example: 'Email is required' }
                }
              }
            }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Operation completed successfully' },
            data: { type: 'object' }
          }
        },
        PaginationResponse: {
          type: 'object',
          properties: {
            data: { type: 'array', items: { type: 'object' } },
            pagination: {
              type: 'object',
              properties: {
                currentPage: { type: 'integer', example: 1 },
                totalPages: { type: 'integer', example: 10 },
                totalItems: { type: 'integer', example: 100 },
                hasMore: { type: 'boolean', example: true }
              }
            }
          }
        }
      },
      responses: {
        BadRequest: {
          description: 'Bad Request',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/Error' }
            }
          }
        },
        Unauthorized: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Access Denied' },
                  message: { type: 'string', example: 'No token provided' }
                }
              }
            }
          }
        },
        Forbidden: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Access Forbidden' },
                  message: { type: 'string', example: 'Insufficient permissions' }
                }
              }
            }
          }
        },
        NotFound: {
          description: 'Not Found',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Not Found' },
                  message: { type: 'string', example: 'Resource not found' }
                }
              }
            }
          }
        },
        TooManyRequests: {
          description: 'Too Many Requests',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Too Many Requests' },
                  message: { type: 'string', example: 'Rate limit exceeded' }
                }
              }
            }
          }
        },
        InternalServerError: {
          description: 'Internal Server Error',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  error: { type: 'string', example: 'Internal Server Error' },
                  message: { type: 'string', example: 'Something went wrong' }
                }
              }
            }
          }
        }
      },
      parameters: {
        PageParameter: {
          in: 'query',
          name: 'page',
          schema: { type: 'integer', minimum: 1, default: 1 },
          description: 'Page number for pagination'
        },
        LimitParameter: {
          in: 'query',
          name: 'limit',
          schema: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
          description: 'Number of items per page'
        },
        SearchParameter: {
          in: 'query',
          name: 'search',
          schema: { type: 'string' },
          description: 'Search query'
        },
        SortParameter: {
          in: 'query',
          name: 'sortBy',
          schema: { type: 'string' },
          description: 'Field to sort by'
        },
        OrderParameter: {
          in: 'query',
          name: 'sortOrder',
          schema: { type: 'string', enum: ['asc', 'desc'], default: 'desc' },
          description: 'Sort order'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Jobs',
        description: 'Job posting and management endpoints'
      },
      {
        name: 'Applications',
        description: 'Job application management endpoints'
      },
      {
        name: 'Resume',
        description: 'Resume generation and management endpoints'
      },
      {
        name: 'Events',
        description: 'Event management and registration endpoints'
      },
      {
        name: 'Assessments',
        description: 'Assessment creation and management endpoints'
      },
      {
        name: 'Notifications',
        description: 'Notification management endpoints'
      },
      {
        name: 'Files',
        description: 'File upload and management endpoints'
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/models/*.js',
    './src/controllers/*.js'
  ]
};

const specs = swaggerJsdoc(options);

module.exports = specs;
