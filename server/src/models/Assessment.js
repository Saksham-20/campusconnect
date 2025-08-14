// server/src/models/Assessment.js
module.exports = (sequelize, DataTypes) => {
  const Assessment = sequelize.define('Assessment', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    jobId: {
      type: DataTypes.INTEGER,
      field: 'job_id',
      references: {
        model: 'jobs',
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
    assessmentType: {
      type: DataTypes.ENUM('technical', 'aptitude', 'personality', 'coding', 'other'),
      allowNull: false,
      field: 'assessment_type'
    },
    duration: {
      type: DataTypes.INTEGER, // in minutes
      allowNull: false
    },
    totalMarks: {
      type: DataTypes.INTEGER,
      defaultValue: 100,
      field: 'total_marks'
    },
    passingMarks: {
      type: DataTypes.INTEGER,
      defaultValue: 60,
      field: 'passing_marks'
    },
    questions: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    instructions: {
      type: DataTypes.TEXT
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_active'
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
    tableName: 'assessments',
    underscored: true,
    timestamps: true
  });

  Assessment.associate = (models) => {
    Assessment.belongsTo(models.Job, {
      foreignKey: 'jobId',
      as: 'job'
    });
    Assessment.belongsTo(models.User, {
      foreignKey: 'createdBy',
      as: 'creator'
    });
    Assessment.hasMany(models.AssessmentResult, {
      foreignKey: 'assessmentId',
      as: 'results'
    });
  };

  return Assessment;
};
