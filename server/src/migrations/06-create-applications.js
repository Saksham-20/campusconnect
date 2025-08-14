// server/src/migrations/06-create-applications.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('applications', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      job_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'jobs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      resume_url: {
        type: Sequelize.STRING(500)
      },
      cover_letter: {
        type: Sequelize.TEXT
      },
      status: {
        type: Sequelize.ENUM('applied', 'screening', 'shortlisted', 'interviewed', 'selected', 'rejected', 'withdrawn'),
        defaultValue: 'applied'
      },
      applied_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      shortlisted_at: {
        type: Sequelize.DATE
      },
      interviewed_at: {
        type: Sequelize.DATE
      },
      result_at: {
        type: Sequelize.DATE
      },
      feedback: {
        type: Sequelize.TEXT
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

    await queryInterface.addIndex('applications', ['job_id']);
    await queryInterface.addIndex('applications', ['student_id']);
    await queryInterface.addIndex('applications', ['status']);
    await queryInterface.addIndex('applications', ['applied_at']);
    await queryInterface.addIndex('applications', ['job_id', 'student_id'], { unique: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('applications');
  }
};