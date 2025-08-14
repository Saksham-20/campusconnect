// server/src/migrations/04-create-recruiter-profiles.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('recruiter_profiles', {
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
      department: {
        type: Sequelize.STRING(100)
      },
      position: {
        type: Sequelize.STRING(100)
      },
      bio: {
        type: Sequelize.TEXT
      },
      experience: {
        type: Sequelize.INTEGER,
        defaultValue: 0
      },
      linkedin_url: {
        type: Sequelize.STRING(255)
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

    await queryInterface.addIndex('recruiter_profiles', ['user_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('recruiter_profiles');
  }
};