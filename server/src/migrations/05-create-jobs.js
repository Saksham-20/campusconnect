// server/src/migrations/05-create-jobs.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('jobs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      organization_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'organizations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      requirements: {
        type: Sequelize.TEXT
      },
      job_type: {
        type: Sequelize.ENUM('internship', 'full_time', 'part_time'),
        allowNull: false
      },
      location: {
        type: Sequelize.STRING(255)
      },
      salary_min: {
        type: Sequelize.INTEGER
      },
      salary_max: {
        type: Sequelize.INTEGER
      },
      experience_required: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      skills_required: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      total_positions: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      application_deadline: {
        type: Sequelize.DATEONLY
      },
      status: {
        type: Sequelize.ENUM('draft', 'active', 'closed', 'cancelled'),
        defaultValue: 'draft'
      },
      eligibility_criteria: {
        type: Sequelize.JSON,
        defaultValue: {}
      },
      created_by: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
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

    await queryInterface.addIndex('jobs', ['organization_id']);
    await queryInterface.addIndex('jobs', ['status']);
    await queryInterface.addIndex('jobs', ['job_type']);
    await queryInterface.addIndex('jobs', ['application_deadline']);
    await queryInterface.addIndex('jobs', ['created_by']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('jobs');
  }
};
