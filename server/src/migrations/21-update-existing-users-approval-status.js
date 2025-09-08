// server/src/migrations/21-update-existing-users-approval-status.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Update existing users to have proper approval status
    await queryInterface.sequelize.query(`
      UPDATE users 
      SET 
        approval_status = CASE 
          WHEN role = 'admin' THEN 'approved'::enum_users_approval_status
          WHEN role IN ('student', 'tpo') THEN 'approved'::enum_users_approval_status
          WHEN role = 'recruiter' THEN 'pending'::enum_users_approval_status
          ELSE 'pending'::enum_users_approval_status
        END,
        is_active = CASE 
          WHEN role = 'admin' THEN true
          WHEN role IN ('student', 'tpo') THEN true
          WHEN role = 'recruiter' THEN false
          ELSE false
        END,
        updated_at = NOW()
      WHERE approval_status IS NULL OR is_active IS NULL
    `);

    // Update existing organizations to have proper approval status
    await queryInterface.sequelize.query(`
      UPDATE organizations 
      SET 
        approval_status = 'approved',
        approved_at = NOW(),
        updated_at = NOW()
      WHERE approval_status IS NULL
    `);
  },

  async down(queryInterface, Sequelize) {
    // This migration cannot be easily reversed as it sets default values
    console.log('Migration 21 cannot be reversed automatically');
  }
};
