// server/src/migrations/23-check-and-fix-jobs-unique-constraints.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('🔍 Checking for unique constraints on jobs table...');
    
    try {
      // Query to find all unique constraints on the jobs table
      const [constraints] = await queryInterface.sequelize.query(`
        SELECT
          conname AS constraint_name,
          pg_get_constraintdef(oid) AS constraint_definition
        FROM pg_constraint
        WHERE conrelid = 'jobs'::regclass
          AND contype = 'u'
        ORDER BY conname;
      `);

      console.log(`Found ${constraints.length} unique constraint(s) on jobs table:`);
      constraints.forEach(constraint => {
        console.log(`  - ${constraint.constraint_name}: ${constraint.constraint_definition}`);
      });

      // Remove any unique constraints that shouldn't be there
      // The jobs table should NOT have unique constraints (except primary key)
      // as multiple jobs with the same title/description/etc. should be allowed
      for (const constraint of constraints) {
        const constraintName = constraint.constraint_name;
        
        // Skip if it's the primary key constraint
        if (constraintName.includes('pkey') || constraintName.includes('primary')) {
          console.log(`  ⏭️  Skipping primary key constraint: ${constraintName}`);
          continue;
        }

        console.log(`  🗑️  Removing unique constraint: ${constraintName}`);
        try {
          await queryInterface.sequelize.query(`
            ALTER TABLE jobs DROP CONSTRAINT IF EXISTS "${constraintName}";
          `);
          console.log(`  ✅ Successfully removed constraint: ${constraintName}`);
        } catch (error) {
          console.error(`  ❌ Error removing constraint ${constraintName}:`, error.message);
        }
      }

      console.log('✅ Unique constraint check completed');
    } catch (error) {
      console.error('❌ Error checking unique constraints:', error.message);
      // Don't throw - this is a diagnostic migration
      console.log('⚠️  Continuing despite error - check database manually if issues persist');
    }
  },

  async down(queryInterface, Sequelize) {
    // This migration cannot be easily reversed as we don't know
    // which constraints were removed
    console.log('⚠️  This migration cannot be reversed automatically');
    console.log('⚠️  If you need to restore unique constraints, check your database logs');
  }
};

