// server/src/app.js
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

const { sequelize } = require('./models');
const errorHandler = require('./middleware/errorHandler');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const jobRoutes = require('./routes/jobs');
const applicationRoutes = require('./routes/applications');
const resumeRoutes = require('./routes/resume');
const eventRoutes = require('./routes/events');
const assessmentRoutes = require('./routes/assessments');
const notificationRoutes = require('./routes/notifications');
const fileRoutes = require('./routes/files');
const organizationsRoutes = require('./routes/organizations');
const achievementRoutes = require('./routes/achievements');
const statisticsRoutes = require('./routes/statistics');
const approvalRoutes = require('./routes/approvals');


const app = express();

// Security middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
  message: {
    error: 'Too many requests from this IP, please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Swagger documentation
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'CampusConnect API',
      version: '1.0.0',
      description: 'A comprehensive campus recruitment platform API',
      contact: {
        name: 'CampusConnect Team',
        email: 'support@campusconnect.com'
      }
    },
    servers: [
      {
        url: process.env.NODE_ENV === 'production' 
          ? 'https://api.campusconnect.com' 
          : 'http://localhost:5000',
        description: process.env.NODE_ENV === 'production' ? 'Production server' : 'Development server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./src/routes/*.js', './src/models/*.js']
};

const specs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'CampusConnect API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    version: '1.0.0'
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/jobs', jobRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/resume', resumeRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/organizations', organizationsRoutes);
app.use('/api/achievements', achievementRoutes);
app.use('/api/statistics', statisticsRoutes);
app.use('/api/approvals', approvalRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use(errorHandler);

// Database connection with retry logic
const connectDB = async (retries = 5, delay = 5000) => {
  for (let i = 0; i < retries; i++) {
    try {
      console.log(`🔍 Attempting database connection... (attempt ${i + 1}/${retries})`);
      console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
      console.log('🔍 DATABASE_URL exists:', !!process.env.DATABASE_URL);
      if (process.env.DATABASE_URL) {
        console.log('🔍 DATABASE_URL starts with:', process.env.DATABASE_URL.substring(0, 30) + '...');
        console.log('🔍 DATABASE_URL contains .render.com:', process.env.DATABASE_URL.includes('.render.com'));
        console.log('🔍 DATABASE_URL contains singapore-postgres:', process.env.DATABASE_URL.includes('singapore-postgres'));
      }
      
      // Log the actual config being used
      console.log('🔍 Sequelize config:', {
        dialect: sequelize.options.dialect,
        ssl: sequelize.options.dialectOptions?.ssl,
        host: sequelize.config.host,
        port: sequelize.config.port,
        database: sequelize.config.database
      });
      
      await sequelize.authenticate();
      console.log('✅ Database connection established successfully');
      
      if (process.env.NODE_ENV === 'development') {
        await sequelize.sync({ alter: true });
        console.log('✅ Database synchronized');
      }
      return; // Success, exit the retry loop
      
    } catch (error) {
      console.error(`❌ Database connection attempt ${i + 1} failed:`, error.message);
      
      if (i === retries - 1) {
        console.error('❌ All database connection attempts failed');
        console.error('❌ Final error:', error);
        process.exit(1);
      }
      
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

process.on('SIGINT', async () => {
  console.log('SIGINT signal received: closing HTTP server');
  await sequelize.close();
  process.exit(0);
});

module.exports = { app, connectDB };
