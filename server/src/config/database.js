// server/src/config/database.js
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

module.exports = {
  development: {
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'campusconnect_dev',
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
    database: process.env.DB_NAME + '_test' || 'campusconnect_test',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: false
  },
  production: (() => {
    if (process.env.DATABASE_URL) {
      // Parse DATABASE_URL manually
      const url = process.env.DATABASE_URL;
      console.log('🔍 Parsing DATABASE_URL for production config');
      
      // Handle both formats: with port and without port
      let urlParts = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
      let username, password, host, port, database;

      if (urlParts) {
        // Format with port: postgresql://user:pass@host:port/db
        [, username, password, host, port, database] = urlParts;
      } else {
        // Format without port: postgresql://user:pass@host/db (default port 5432)
        urlParts = url.match(/postgresql:\/\/([^:]+):([^@]+)@([^\/]+)\/(.+)/);
        if (urlParts) {
          [, username, password, host, database] = urlParts;
          port = '5432'; // Default PostgreSQL port
        }
      }

      if (urlParts) {
        console.log('🔍 Parsed DATABASE_URL:', { username, host, port, database });
        return {
          username,
          password,
          host,
          port: parseInt(port),
          database,
          dialect: 'postgres',
          dialectOptions: {
            ssl: {
              require: true,
              rejectUnauthorized: false
            }
          },
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
  })()
};