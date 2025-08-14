// server/src/models/RecruiterProfile.js
module.exports = (sequelize, DataTypes) => {
  const RecruiterProfile = sequelize.define('RecruiterProfile', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      unique: true,
      field: 'user_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    department: {
      type: DataTypes.STRING(100)
    },
    position: {
      type: DataTypes.STRING(100)
    },
    bio: {
      type: DataTypes.TEXT
    },
    experience: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    linkedinUrl: {
      type: DataTypes.STRING(255),
      field: 'linkedin_url',
      validate: {
        isUrl: true
      }
    }
  }, {
    tableName: 'recruiter_profiles',
    underscored: true,
    timestamps: true
  });

  RecruiterProfile.associate = (models) => {
    RecruiterProfile.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return RecruiterProfile;
};