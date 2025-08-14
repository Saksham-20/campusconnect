// server/src/models/Event.js
module.exports = (sequelize, DataTypes) => {
  const Event = sequelize.define('Event', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    organizationId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'organization_id',
      references: {
        model: 'organizations',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING(255),
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT
    },
    eventType: {
      type: DataTypes.ENUM('campus_drive', 'info_session', 'workshop', 'seminar', 'job_fair', 'other'),
      allowNull: false,
      field: 'event_type'
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'start_time'
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'end_time'
    },
    location: {
      type: DataTypes.STRING(255)
    },
    virtualLink: {
      type: DataTypes.STRING(500),
      field: 'virtual_link',
      validate: {
        isUrl: true
      }
    },
    maxParticipants: {
      type: DataTypes.INTEGER,
      field: 'max_participants'
    },
    registrationDeadline: {
      type: DataTypes.DATE,
      field: 'registration_deadline'
    },
    status: {
      type: DataTypes.ENUM('draft', 'scheduled', 'ongoing', 'completed', 'cancelled'),
      defaultValue: 'draft'
    },
    createdBy: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'created_by',
      references: {
        model: 'users',
        key: 'id'
      }
    }
  }, {
    tableName: 'events',
    underscored: true,
    timestamps: true
  });

  Event.associate = (models) => {
    Event.belongsTo(models.Organization, {
      foreignKey: 'organizationId',
      as: 'organization'
    });
    Event.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    Event.hasMany(models.EventRegistration, {
      foreignKey: 'eventId',
      as: 'registrations'
    });
  };

  return Event;
};