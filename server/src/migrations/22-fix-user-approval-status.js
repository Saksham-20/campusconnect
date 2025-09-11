'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('🔧 Fixing user approval status for existing users...');
    
    // Update all users with pending approval status to approved and active
    // This fixes the issue where users were created with wrong approval status
    await queryInterface.bulkUpdate('users', 
      { 
        approval_status: 'approved',
        is_active: true
      },
      {
        approval_status: 'pending',
        is_active: false
      }
    );
    
    console.log('✅ User approval status fixed');
  },

  async down(queryInterface, Sequelize) {
    // This migration is not reversible as we don't know which users were originally pending
    console.log('⚠️ This migration cannot be reversed');
  }
};
