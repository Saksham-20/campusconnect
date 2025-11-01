// server/src/config/database.js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// Helper function to parse DATABASE_URL for production
function parseDatabaseUrl() {
  if (process.env.DATABASE_URL) {
    // Parse DATABASE_URL manually
    const url = process.env.DATABASE_URL;
    console.log('🔍 Parsing DATABASE_URL for production config');
    
    // Handle both formats: with port and without port, and both postgres:// and postgresql://
    const schemeRegex = /postgres(?:ql)?:\/\//;
    // Normalize scheme to ease regex matching
    const normalized = url.replace(schemeRegex, 'postgres://');
    let urlParts = normalized.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    let username, password, host, port, database;

    if (urlParts) {
      // Format with port: postgresql://user:pass@host:port/db
      [, username, password, host, port, database] = urlParts;
    } else {
      // Format without port: postgresql://user:pass@host/db (default port 5432)
      urlParts = normalized.match(/postgres:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/);
      if (urlParts) {
        [, username, password, host, database] = urlParts;
        port = '5432'; // Default PostgreSQL port
      }
    }

    if (urlParts) {
      console.log('🔍 Parsed DATABASE_URL:', { username, host, port, database });
      const sslRequired = process.env.PGSSLMODE === 'require' || process.env.DATABASE_SSL === 'true' || process.env.NODE_ENV === 'production';
      return {
        username,
        password,
        host,
        port: parseInt(port),
        database,
        dialect: 'postgres',
        dialectOptions: sslRequired
          ? { ssl: { require: true, rejectUnauthorized: false } }
          : {},
        logging: false,
        pool: {
          max: 20,
          min: 5,
          acquire: 60000,
          idle: 10000
        }
      };
    } else {
      console.error('❌ Failed to parse DATABASE_URL:', url);
      throw new Error('Invalid DATABASE_URL format');
    }
  } else {
    console.error('❌ DATABASE_URL not found in production');
    throw new Error('DATABASE_URL is required in production');
  }
}

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'edumapping_dev',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres123',
    database: (process.env.DB_NAME || 'edumapping') + '_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  production: parseDatabaseUrl
};