// server/src/migrations/01-create-organizations.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('organizations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      type: {
        type: Sequelize.ENUM('university', 'company'),
        allowNull: false
      },
      domain: {
        type: Sequelize.STRING(100),
        unique: true
      },
      logo_url: {
        type: Sequelize.STRING(500)
      },
      address: {
        type: Sequelize.TEXT
      },
      contact_email: {
        type: Sequelize.STRING(255)
      },
      contact_phone: {
        type: Sequelize.STRING(20)
      },
      website: {
        type: Sequelize.STRING(255)
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

    await queryInterface.addIndex('organizations', ['type']);
    await queryInterface.addIndex('organizations', ['is_verified']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('organizations');
  }
};