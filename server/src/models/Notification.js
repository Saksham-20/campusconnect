// server/src/models/Notification.js
module.exports = (sequelize, DataTypes) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    message: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    notificationType: {
      type: DataTypes.ENUM('application_update', 'job_alert', 'event_reminder', 'system_alert', 'general'),
      allowNull: false,
      field: 'notification_type'
    },
    isRead: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_read'
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      defaultValue: 'medium'
    },
    metadata: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    expiresAt: {
      type: DataTypes.DATE,
      field: 'expires_at'
    }
  }, {
    tableName: 'notifications',
    underscored: true,
    timestamps: true
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Notification;
};
