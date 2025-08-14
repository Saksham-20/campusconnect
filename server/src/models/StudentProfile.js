// server/src/models/StudentProfile.js
module.exports = (sequelize, DataTypes) => {
  const StudentProfile = sequelize.define('StudentProfile', {
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
    studentId: {
      type: DataTypes.STRING(50),
      field: 'student_id'
    },
    dateOfBirth: {
      type: DataTypes.DATEONLY,
      field: 'date_of_birth'
    },
    gender: {
      type: DataTypes.ENUM('male', 'female', 'other')
    },
    course: {
      type: DataTypes.STRING(100)
    },
    branch: {
      type: DataTypes.STRING(100)
    },
    yearOfStudy: {
      type: DataTypes.INTEGER,
      field: 'year_of_study',
      validate: {
        min: 1,
        max: 6
      }
    },
    graduationYear: {
      type: DataTypes.INTEGER,
      field: 'graduation_year'
    },
    cgpa: {
      type: DataTypes.DECIMAL(3, 2),
      validate: {
        min: 0,
        max: 10
      }
    },
    percentage: {
      type: DataTypes.DECIMAL(5, 2),
      validate: {
        min: 0,
        max: 100
      }
    },
    address: {
      type: DataTypes.TEXT
    },
    skills: {
      type: DataTypes.JSON,
      defaultValue: []
    },
    bio: {
      type: DataTypes.TEXT
    },
    linkedinUrl: {
      type: DataTypes.STRING(255),
      field: 'linkedin_url',
      validate: {
        isUrl: true
      }
    },
    githubUrl: {
      type: DataTypes.STRING(255),
      field: 'github_url',
      validate: {
        isUrl: true
      }
    },
    portfolioUrl: {
      type: DataTypes.STRING(255),
      field: 'portfolio_url',
      validate: {
        isUrl: true
      }
    },
    resumeUrl: {
      type: DataTypes.STRING(500),
      field: 'resume_url'
    },
    isEligible: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: 'is_eligible'
    },
    placementStatus: {
      type: DataTypes.ENUM('placed', 'unplaced', 'deferred'),
      defaultValue: 'unplaced',
      field: 'placement_status'
    }
  }, {
    tableName: 'student_profiles',
    underscored: true,
    timestamps: true
  });

  StudentProfile.associate = (models) => {
    StudentProfile.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'user'
    });
  };

  return StudentProfile;
};
