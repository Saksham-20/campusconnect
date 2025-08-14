'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('assessment_results', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      assessment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'assessments',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      answers: {
        type: Sequelize.JSON,
        defaultValue: []
      },
      score: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      percentage: {
        type: Sequelize.DECIMAL(5, 2),
        defaultValue: 0.00
      },
      time_spent: {
        type: Sequelize.INTEGER,
        comment: 'Time spent in minutes'
      },
      started_at: {
        type: Sequelize.DATE
      },
      submitted_at: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM('started', 'completed', 'abandoned'),
        defaultValue: 'started'
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

    await queryInterface.addIndex('assessment_results', ['assessment_id']);
    await queryInterface.addIndex('assessment_results', ['user_id']);
    await queryInterface.addIndex('assessment_results', ['status']);
    await queryInterface.addIndex('assessment_results', ['assessment_id', 'user_id'], { unique: true });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('assessment_results');
  }
};