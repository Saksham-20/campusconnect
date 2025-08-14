'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assessments', {
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
        type: Sequelize.TEXT
      },
      assessment_type: {
        type: Sequelize.ENUM('technical', 'aptitude', 'personality', 'coding', 'other'),
        allowNull: false
      },
      duration: {
        type: Sequelize.INTEGER,
        allowNull: false,
        comment: 'Duration in minutes'
      },
      total_marks: {
        type: Sequelize.INTEGER,
        defaultValue: 100
      },
      passing_marks: {
        type: Sequelize.INTEGER,
        defaultValue: 60
      },
      questions: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      instructions: {
        type: Sequelize.TEXT
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      start_time: {
        type: Sequelize.DATE
      },
      end_time: {
        type: Sequelize.DATE
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

    await queryInterface.addIndex('assessments', ['organization_id']);
    await queryInterface.addIndex('assessments', ['assessment_type']);
    await queryInterface.addIndex('assessments', ['is_active']);
    await queryInterface.addIndex('assessments', ['created_by']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('assessments');
  }
};