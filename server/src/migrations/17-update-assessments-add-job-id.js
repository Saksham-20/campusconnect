// server/src/migrations/17-update-assessments-add-job-id.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if job_id column already exists
    const tableDescription = await queryInterface.describeTable('assessments');
    
    // Add job_id field if it doesn't exist
    if (!tableDescription.job_id) {
      await queryInterface.addColumn('assessments', 'job_id', {
        type: Sequelize.INTEGER,
        references: {
          model: 'jobs',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });

      // Add index for job_id
      await queryInterface.addIndex('assessments', ['job_id']);
    }

    // Remove organization_id field and its index if it exists
    if (tableDescription.organization_id) {
      await queryInterface.removeIndex('assessments', ['organization_id']);
      await queryInterface.removeColumn('assessments', 'organization_id');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('assessments');
    
    // Revert: add organization_id back if it doesn't exist
    if (!tableDescription.organization_id) {
      await queryInterface.addColumn('assessments', 'organization_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'organizations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      });

      // Revert: add index for organization_id
      await queryInterface.addIndex('assessments', ['organization_id']);
    }

    // Revert: remove job_id field and its index if it exists
    if (tableDescription.job_id) {
      await queryInterface.removeIndex('assessments', ['job_id']);
      await queryInterface.removeColumn('assessments', 'job_id');
    }
  }
};
