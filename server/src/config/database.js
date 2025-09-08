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
  production: {
    username: process.env.DATABASE_URL ? process.env.DATABASE_URL.split('://')[1].split(':')[0] : 'campusconnect_user',
    password: process.env.DATABASE_URL ? process.env.DATABASE_URL.split('://')[1].split(':')[1].split('@')[0] : 'hS2eYgters6pg5SsLl7KolednqZ34m2w',
    database: process.env.DATABASE_URL ? process.env.DATABASE_URL.split('/').pop() : 'campusconnect_prod_m1s6',
    host: process.env.DATABASE_URL ? process.env.DATABASE_URL.split('@')[1].split(':')[0] : 'dpg-d2vctker433s73f3n040-a',
    port: process.env.DATABASE_URL ? parseInt(process.env.DATABASE_URL.split('@')[1].split(':')[1].split('/')[0]) : 5432,
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
    },
    retry: {
      match: [
        /ETIMEDOUT/,
        /EHOSTUNREACH/,
        /ECONNRESET/,
        /ECONNREFUSED/,
        /ETIMEDOUT/,
        /ESOCKETTIMEDOUT/,
        /EHOSTUNREACH/,
        /EPIPE/,
        /EAI_AGAIN/,
        /SequelizeConnectionError/,
        /SequelizeConnectionRefusedError/,
        /SequelizeHostNotFoundError/,
        /SequelizeHostNotReachableError/,
        /SequelizeInvalidConnectionError/,
        /SequelizeConnectionTimedOutError/
      ],
      max: 5
    }
  }
};