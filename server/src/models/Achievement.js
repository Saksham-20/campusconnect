// server/src/models/Achievement.js
module.exports = (sequelize, DataTypes) => {
  const Achievement = sequelize.define('Achievement', {
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
    description: {
      type: DataTypes.TEXT
    },
    achievementType: {
      type: DataTypes.ENUM('academic', 'project', 'certification', 'competition', 'publication', 'other'),
      allowNull: false,
      field: 'achievement_type'
    },
    issuingOrganization: {
      type: DataTypes.STRING(255),
      field: 'issuing_organization'
    },
    issueDate: {
      type: DataTypes.DATEONLY,
      field: 'issue_date'
    },
    expiryDate: {
      type: DataTypes.DATEONLY,
      field: 'expiry_date'
    },
    credentialUrl: {
      type: DataTypes.STRING(500),
      field: 'credential_url',
      validate: {
        isUrl: true
      }
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: 'is_verified'
    }
  }, {
    tableName: 'achievements',
    underscored: true,
    timestamps: true
  });

  Achievement.associate = (models) => {
    Achievement.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return Achievement;
};
