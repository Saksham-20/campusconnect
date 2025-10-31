// server/src/migrations/24-fix-jobs-sequence.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    console.log('🔧 Fixing jobs table auto-increment sequence...');
    
    try {
      // Get the maximum ID from the jobs table
      const [result] = await queryInterface.sequelize.query(`
        SELECT MAX(id) as max_id FROM jobs;
      `);
      
      const maxId = result[0]?.max_id || 0;
      const nextId = maxId + 1;
      
      console.log(`  Current max ID: ${maxId}`);
      console.log(`  Setting sequence to start from: ${nextId}`);
      
      // Reset the sequence to be one higher than the max ID
      await queryInterface.sequelize.query(`
        SELECT setval(pg_get_serial_sequence('jobs', 'id'), ${nextId}, false);
      `);
      
      console.log('✅ Jobs sequence fixed successfully');
    } catch (error) {
      console.error('❌ Error fixing jobs sequence:', error.message);
      throw error;
    }
  },

  async down(queryInterface, Sequelize) {
    // This migration cannot be easily reversed
    console.log('⚠️  This migration cannot be reversed automatically');
  }
};

