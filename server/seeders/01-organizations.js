// server/src/seeders/01-organizations.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('organizations', [
      {
        id: 1,
        name: 'Tech University',
        type: 'university',
        domain: 'techuniversity.edu',
        contact_email: 'admin@techuniversity.edu',
        contact_phone: '+1-555-0100',
        website: 'https://techuniversity.edu',
        address: '123 University Ave, Tech City, TC 12345',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'TechCorp Industries',
        type: 'company',
        domain: 'techcorp.com',
        contact_email: 'hr@techcorp.com',
        contact_phone: '+1-555-0200',
        website: 'https://techcorp.com',
        address: '456 Business Blvd, Corporate City, CC 67890',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'StartupXYZ',
        type: 'company',
        domain: 'startupxyz.io',
        contact_email: 'hiring@startupxyz.io',
        contact_phone: '+1-555-0300',
        website: 'https://startupxyz.io',
        address: '789 Innovation Dr, Startup Valley, SV 13579',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'Global Engineering College',
        type: 'university',
        domain: 'gec.edu',
        contact_email: 'placement@gec.edu',
        contact_phone: '+1-555-0400',
        website: 'https://gec.edu',
        address: '321 College Road, Engineering City, EC 24680',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('organizations', null, {});
  }
};
