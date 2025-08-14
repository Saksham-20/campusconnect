// server/src/models/EventRegistration.js
module.exports = (sequelize, DataTypes) => {
  const EventRegistration = sequelize.define('EventRegistration', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    eventId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'event_id',
      references: {
        model: 'events',
        key: 'id'
      }
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
    status: {
      type: DataTypes.ENUM('registered', 'attended', 'no_show', 'cancelled'),
      defaultValue: 'registered'
    },
    registeredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'registered_at'
    }
  }, {
    tableName: 'event_registrations',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['event_id', 'user_id']
      }
    ]
  });

  EventRegistration.associate = (models) => {
    EventRegistration.belongsTo(models.Event, {
      foreignKey: 'eventId',
      as: 'event'
    });
    EventRegistration.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return EventRegistration;
};