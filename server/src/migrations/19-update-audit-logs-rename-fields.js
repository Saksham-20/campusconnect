// server/src/migrations/19-update-audit-logs-rename-fields.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if columns exist before renaming
    const tableDescription = await queryInterface.describeTable('audit_logs');
    
    // Rename resource_type to entity_type if it exists
    if (tableDescription.resource_type && !tableDescription.entity_type) {
      await queryInterface.renameColumn('audit_logs', 'resource_type', 'entity_type');
    }
    
    // Rename resource_id to entity_id if it exists
    if (tableDescription.resource_id && !tableDescription.entity_id) {
      await queryInterface.renameColumn('audit_logs', 'resource_id', 'entity_id');
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('audit_logs');
    
    // Revert: rename entity_type back to resource_type if it exists
    if (tableDescription.entity_type && !tableDescription.resource_type) {
      await queryInterface.renameColumn('audit_logs', 'entity_type', 'resource_type');
    }
    
    // Revert: rename entity_id back to resource_id if it exists
    if (tableDescription.entity_id && !tableDescription.resource_id) {
      await queryInterface.renameColumn('audit_logs', 'entity_id', 'resource_id');
    }
  }
};
