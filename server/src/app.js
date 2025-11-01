// server/src/app.js
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

// Use models for both development and production
const models = require('./models');
const sequelize = models.sequelize;
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

// Trust proxy for rate limiting (required for Render)
app.set('trust proxy', 1);

// Security middleware (more strict in production)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: process.env.NODE_ENV === 'production' ? {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  } : false,
  hsts: process.env.NODE_ENV === 'production' ? undefined : false
}));

// CORS configuration
app.use(cors({
  origin: (origin, callback) => {
    const defaultDevOrigins = [
      'http://localhost:3000',
      'http://127.0.0.1:3000'
    ];
    const allowed = new Set([
      process.env.FRONTEND_URL || '',
      'https://campusconnect-frontend-li7i.onrender.com',
      'https://campusconnect-frontend-sw79.onrender.com',
      ...(process.env.NODE_ENV === 'development' ? defaultDevOrigins : [])
    ].filter(Boolean));

    if (!origin) return callback(null, true); // allow non-browser clients
    if (allowed.has(origin)) return callback(null, true);
    return callback(new Error('CORS not allowed from this origin'));
  },
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
        url: process.env.API_PUBLIC_URL 
          || (process.env.NODE_ENV === 'production' 
                ? `http://localhost:${process.env.PORT || 5000}`
                : `http://localhost:${process.env.PORT || 5000}`),
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

// Debug endpoint to check database and user
app.get('/api/debug/user/:email', async (req, res) => {
  try {
    const { User, Organization } = models;
    const { email } = req.params;
    
    console.log('🔍 Debug: Looking for user with email:', email);
    console.log('🔍 Debug: Sequelize instance:', sequelize ? 'Available' : 'Not available');
    
    // Test database connection first
    await sequelize.authenticate();
    console.log('🔍 Debug: Database connection successful');
    
    const user = await User.findOne({
      where: { email },
      include: [
        {
          model: Organization,
          as: 'organization'
        }
      ]
    });
    
    console.log('🔍 Debug: User found:', user ? 'Yes' : 'No');
    
    res.json({
      found: !!user,
      user: user ? {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        approvalStatus: user.approvalStatus,
        organization: user.organization
      } : null
    });
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Manual seeding endpoint
app.post('/api/debug/seed', async (req, res) => {
  try {
    console.log('🌱 Starting manual database seeding...');
    
    // Run the seeders
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    const { stdout, stderr } = await execAsync('NODE_ENV=production npx sequelize-cli db:seed:all');
    
    console.log('🌱 Seeding output:', stdout);
    if (stderr) console.log('🌱 Seeding errors:', stderr);
    
    res.json({
      success: true,
      message: 'Database seeded successfully',
      output: stdout
    });
  } catch (error) {
    console.error('❌ Seeding error:', error);
    res.status(500).json({ 
      success: false,
      error: error.message,
      output: error.stdout || '',
      errors: error.stderr || ''
    });
  }
});

// List all users endpoint
app.get('/api/debug/users', async (req, res) => {
  try {
    const { User, Organization } = models;
    
    console.log('🔍 Debug: Fetching all users...');
    console.log('🔍 Debug: Sequelize instance:', sequelize ? 'Available' : 'Not available');
    
    // Test database connection first
    await sequelize.authenticate();
    console.log('🔍 Debug: Database connection successful');
    
    const users = await User.findAll({
      include: [
        {
          model: Organization,
          as: 'organization'
        }
      ],
      limit: 10
    });
    
    console.log('🔍 Debug: Found', users.length, 'users');
    
    res.json({
      count: users.length,
      users: users.map(user => ({
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        approvalStatus: user.approvalStatus,
        organization: user.organization ? {
          id: user.organization.id,
          name: user.organization.name
        } : null
      }))
    });
  } catch (error) {
    console.error('❌ Debug error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Test login endpoint with detailed debugging
app.post('/api/debug/test-login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('🔍 Debug: Testing login for email:', email);
    
    const { User, Organization } = models;
    const bcrypt = require('bcryptjs');
    
    // Test database connection first
    console.log('🔍 Debug: Testing database connection...');
    await sequelize.authenticate();
    console.log('🔍 Debug: Database connection successful');
    
    // Step 1: Check if user exists
    console.log('🔍 Step 1: Looking for user...');
    const user = await User.findOne({
      where: { email, isActive: true },
      include: [
        {
          model: Organization,
          as: 'organization'
        }
      ]
    });
    
    console.log('🔍 User found:', user ? 'Yes' : 'No');
    if (user) {
      console.log('🔍 User details:', {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        approvalStatus: user.approvalStatus,
        hasPasswordHash: !!user.passwordHash,
        organizationId: user.organizationId
      });
    }
    
    if (!user) {
      return res.json({
        success: false,
        step: 'user_lookup',
        message: 'User not found or inactive',
        user: null
      });
    }
    
    // Step 2: Check password
    console.log('🔍 Step 2: Checking password...');
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    console.log('🔍 Password valid:', isPasswordValid);
    
    if (!isPasswordValid) {
      return res.json({
        success: false,
        step: 'password_check',
        message: 'Invalid password',
        user: {
          id: user.id,
          email: user.email,
          role: user.role
        }
      });
    }
    
    // Step 3: Check approval status
    console.log('🔍 Step 3: Checking approval status...');
    if (user.approvalStatus !== 'approved') {
      return res.json({
        success: false,
        step: 'approval_check',
        message: 'User not approved',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          approvalStatus: user.approvalStatus
        }
      });
    }
    
    // Step 4: Generate tokens (simplified)
    console.log('🔍 Step 4: Generating tokens...');
    const jwt = require('jsonwebtoken');
    const accessToken = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '1h' }
    );
    
    console.log('🔍 Access token generated:', !!accessToken);
    
    res.json({
      success: true,
      message: 'Login test successful',
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        approvalStatus: user.approvalStatus,
        organization: user.organization
      },
      hasToken: !!accessToken
    });
    
  } catch (error) {
    console.error('❌ Debug login error:', error);
    res.status(500).json({ 
      success: false,
      step: 'error',
      error: error.message,
      stack: error.stack
    });
  }
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

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production' && process.env.SERVE_CLIENT !== 'false') {
  const clientBuildPath = path.join(__dirname, '../../client/build');
  app.use(express.static(clientBuildPath));
  
  // Handle React routing - return all non-API requests to React app
  app.get('*', (req, res) => {
    if (!req.path.startsWith('/api')) {
      res.sendFile(path.join(clientBuildPath, 'index.html'));
    } else {
      res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.originalUrl} not found`,
        timestamp: new Date().toISOString()
      });
    }
  });
} else {
  // 404 handler for API routes in development
  app.use('/api/*', (req, res) => {
    res.status(404).json({
      error: 'Not Found',
      message: `Route ${req.originalUrl} not found`,
      timestamp: new Date().toISOString()
    });
  });
}

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
