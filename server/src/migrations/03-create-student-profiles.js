// server/src/migrations/03-create-student-profiles.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('student_profiles', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      student_id: {
        type: Sequelize.STRING(50)
      },
      date_of_birth: {
        type: Sequelize.DATEONLY
      },
      gender: {
        type: Sequelize.ENUM('male', 'female', 'other')
      },
      course: {
        type: Sequelize.STRING(100)
      },
      branch: {
        type: Sequelize.STRING(100)
      },
      year_of_study: {
        type: Sequelize.INTEGER
      },
      graduation_year: {
        type: Sequelize.INTEGER
      },
      cgpa: {
        type: Sequelize.DECIMAL(3, 2)
      },
      percentage: {
        type: Sequelize.DECIMAL(5, 2)
      },
      address: {
        type: Sequelize.TEXT
      },
      skills: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      bio: {
        type: Sequelize.TEXT
      },
      linkedin_url: {
        type: Sequelize.STRING(255)
      },
      github_url: {
        type: Sequelize.STRING(255)
      },
      portfolio_url: {
        type: Sequelize.STRING(255)
      },
      resume_url: {
        type: Sequelize.STRING(500)
      },
      is_eligible: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      placement_status: {
        type: Sequelize.ENUM('placed', 'unplaced', 'deferred'),
        defaultValue: 'unplaced'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });

    await queryInterface.addIndex('student_profiles', ['user_id']);
    await queryInterface.addIndex('student_profiles', ['graduation_year']);
    await queryInterface.addIndex('student_profiles', ['placement_status']);
    await queryInterface.addIndex('student_profiles', ['is_eligible']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('student_profiles');
  }
};