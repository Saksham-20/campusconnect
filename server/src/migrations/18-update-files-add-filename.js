// server/src/migrations/18-update-files-add-filename.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Check if filename column already exists
    const tableDescription = await queryInterface.describeTable('files');
    
    if (!tableDescription.filename) {
      await queryInterface.addColumn('files', 'filename', {
        type: Sequelize.STRING(255),
        allowNull: false,
        defaultValue: 'unnamed_file' // Temporary default for existing records
      });

      // Add index for filename
      await queryInterface.addIndex('files', ['filename']);
    }
  },

  async down(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('files');
    
    if (tableDescription.filename) {
      await queryInterface.removeIndex('files', ['filename']);
      await queryInterface.removeColumn('files', 'filename');
    }
  }
};
