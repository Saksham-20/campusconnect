// server/src/models/AssessmentResult.js
module.exports = (sequelize, DataTypes) => {
  const AssessmentResult = sequelize.define('AssessmentResult', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    assessmentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'assessment_id',
      references: {
        model: 'assessments',
        key: 'id'
      }
    },
    studentId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'student_id',
      references: {
        model: 'users',
        key: 'id'
      }
    },
    answers: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    score: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('in_progress', 'completed', 'submitted'),
      defaultValue: 'in_progress'
    },
    startedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
      field: 'started_at'
    },
    submittedAt: {
      type: DataTypes.DATE,
      field: 'submitted_at'
    },
    timeSpent: {
      type: DataTypes.INTEGER, // in seconds
      field: 'time_spent'
    }
  }, {
    tableName: 'assessment_results',
    underscored: true,
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['assessment_id', 'student_id']
      }
    ]
  });

  AssessmentResult.associate = (models) => {
    AssessmentResult.belongsTo(models.Assessment, {
      foreignKey: 'assessmentId',
      as: 'assessment'
    });
    AssessmentResult.belongsTo(models.User, {
      foreignKey: 'studentId',
      as: 'student'
    });
  };

  return AssessmentResult;
};