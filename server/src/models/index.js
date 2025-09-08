// server/src/models/index.js
const { Sequelize } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const sequelize = new Sequelize(config[env]);

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
