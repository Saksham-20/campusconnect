// server/src/migrations/07-create-achievements.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('achievements', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
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
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT
      },
      achievement_type: {
        type: Sequelize.ENUM('academic', 'project', 'certification', 'competition', 'publication', 'other'),
        allowNull: false
      },
      issuing_organization: {
        type: Sequelize.STRING(255)
      },
      issue_date: {
        type: Sequelize.DATEONLY
      },
      expiry_date: {
        type: Sequelize.DATEONLY
      },
      credential_url: {
        type: Sequelize.STRING(500)
      },
      is_verified: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
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

    await queryInterface.addIndex('achievements', ['user_id']);
    await queryInterface.addIndex('achievements', ['achievement_type']);
    await queryInterface.addIndex('achievements', ['issue_date']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('achievements');
  }
};