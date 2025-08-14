// server/src/migrations/08-create-events.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('events', {
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
      event_type: {
        type: Sequelize.ENUM('campus_drive', 'info_session', 'workshop', 'seminar', 'job_fair', 'other'),
        allowNull: false
      },
      start_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: false
      },
      location: {
        type: Sequelize.STRING(255)
      },
      virtual_link: {
        type: Sequelize.STRING(500)
      },
      max_participants: {
        type: Sequelize.INTEGER
      },
      registration_deadline: {
        type: Sequelize.DATE
      },
      status: {
        type: Sequelize.ENUM('draft', 'scheduled', 'ongoing', 'completed', 'cancelled'),
        defaultValue: 'draft'
      },
      created_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
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

    await queryInterface.addIndex('events', ['organization_id']);
    await queryInterface.addIndex('events', ['event_type']);
    await queryInterface.addIndex('events', ['status']);
    await queryInterface.addIndex('events', ['start_time']);
    await queryInterface.addIndex('events', ['registration_deadline']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('events');
  }
};
