// server/src/migrations/16-update-users-add-approval-fields.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if columns already exist
    const tableDescription = await queryInterface.describeTable('users');
    
    // Add approval_status if it doesn't exist
    if (!tableDescription.approval_status) {
      await queryInterface.addColumn('users', 'approval_status', {
        type: Sequelize.ENUM('pending', 'approved', 'rejected'),
        defaultValue: 'pending',
        allowNull: false
      });
    }

    // Add approved_by if it doesn't exist
    if (!tableDescription.approved_by) {
      await queryInterface.addColumn('users', 'approved_by', {
        type: Sequelize.INTEGER,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }

    // Add approved_at if it doesn't exist
    if (!tableDescription.approved_at) {
      await queryInterface.addColumn('users', 'approved_at', {
        type: Sequelize.DATE
      });
    }

    // Add approval_notes if it doesn't exist
    if (!tableDescription.approval_notes) {
      await queryInterface.addColumn('users', 'approval_notes', {
        type: Sequelize.TEXT
      });
    }

    // Add index for approval status if it doesn't exist
    try {
      await queryInterface.addIndex('users', ['approval_status']);
    } catch (error) {
      // Index might already exist, ignore error
      console.log('Index on approval_status might already exist');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('users');
    
    if (tableDescription.approval_notes) {
      await queryInterface.removeColumn('users', 'approval_notes');
    }
    if (tableDescription.approved_at) {
      await queryInterface.removeColumn('users', 'approved_at');
    }
    if (tableDescription.approved_by) {
      await queryInterface.removeColumn('users', 'approved_by');
    }
    if (tableDescription.approval_status) {
      await queryInterface.removeColumn('users', 'approval_status');
      
      // Remove the ENUM type
      await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_users_approval_status";');
    }
  }
};
