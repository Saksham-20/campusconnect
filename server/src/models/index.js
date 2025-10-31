// server/src/models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
console.log('🔍 Environment:', env);
console.log('🔍 DATABASE_URL set:', !!process.env.DATABASE_URL);

// Get the appropriate config - call the function if it's production
let dbConfig;
if (env === 'production') {
  dbConfig = config[env](); // Call the function for production
} else {
  dbConfig = config[env]; // Use the object directly for development/test
}

console.log('🔍 Config being used:', dbConfig ? 'Found' : 'Not found');

// Initialize Sequelize using explicit params to support both dev (object config)
// and prod (parsed DATABASE_URL config)
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.username,
  dbConfig.password,
  dbConfig
);

const db = {};

// Import models
db.Organization = require('./Organization')(sequelize, Sequelize.DataTypes);
db.User = require('./User')(sequelize, Sequelize.DataTypes);
db.StudentProfile = require('./StudentProfile')(sequelize, Sequelize.DataTypes);
db.RecruiterProfile = require('./RecruiterProfile')(sequelize, Sequelize.DataTypes);
db.Job = require('./Job')(sequelize, Sequelize.DataTypes);
db.Application = require('./Application')(sequelize, Sequelize.DataTypes);
db.Achievement = require('./Achievement')(sequelize, Sequelize.DataTypes);
db.Event = require('./Event')(sequelize, Sequelize.DataTypes);
db.EventRegistration = require('./EventRegistration')(sequelize, Sequelize.DataTypes);
db.Assessment = require('./Assessment')(sequelize, Sequelize.DataTypes);
db.AssessmentResult = require('./AssessmentResult')(sequelize, Sequelize.DataTypes);
db.Notification = require('./Notification')(sequelize, Sequelize.DataTypes);
db.File = require('./File')(sequelize, Sequelize.DataTypes);
db.AuditLog = require('./AuditLog')(sequelize, Sequelize.DataTypes);

// Define associations
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
