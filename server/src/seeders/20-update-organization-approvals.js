// server/src/seeders/20-update-organization-approvals.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Update organizations with the correct approved_by values
    // This seeder runs after both organizations and users have been seeded
    
    await queryInterface.bulkUpdate('organizations', 
      {
        approved_by: 1, // System Administrator
        updated_at: new Date()
      },
      {
        id: [1, 2, 3, 4] // Update all organizations
      }
    );
  },

  async down(queryInterface, Sequelize) {
    // Revert: set approved_by back to null
    await queryInterface.bulkUpdate('organizations', 
      {
        approved_by: null,
        updated_at: new Date()
      },
      {
        id: [1, 2, 3, 4] // Update all organizations
      }
    );
  }
};
