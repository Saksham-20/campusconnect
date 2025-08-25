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
        logo_url: 'https://via.placeholder.com/150x150/4F46E5/FFFFFF?text=TU',
        contact_email: 'admin@techuniversity.edu',
        contact_phone: '+1-555-0100',
        website: 'https://techuniversity.edu',
        address: '123 University Ave, Tech City, TC 12345',
        is_verified: true,
        approval_status: 'approved',
        approved_by: null, // Will be updated after users are seeded
        approved_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        name: 'TechCorp Industries',
        type: 'company',
        domain: 'techcorp.com',
        logo_url: 'https://via.placeholder.com/150x150/10B981/FFFFFF?text=TC',
        contact_email: 'hr@techcorp.com',
        contact_phone: '+1-555-0200',
        website: 'https://techcorp.com',
        address: '456 Business Blvd, Corporate City, CC 67890',
        is_verified: true,
        approval_status: 'approved',
        approved_by: null, // Will be updated after users are seeded
        approved_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        name: 'StartupXYZ',
        type: 'company',
        domain: 'startupxyz.io',
        logo_url: 'https://via.placeholder.com/150x150/F59E0B/FFFFFF?text=SX',
        contact_email: 'hiring@startupxyz.io',
        contact_phone: '+1-555-0300',
        website: 'https://startupxyz.io',
        address: '789 Innovation Dr, Startup Valley, SV 13579',
        is_verified: true,
        approval_status: 'approved',
        approved_by: null, // Will be updated after users are seeded
        approved_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        name: 'Global Engineering College',
        type: 'university',
        domain: 'gec.edu',
        logo_url: 'https://via.placeholder.com/150x150/EF4444/FFFFFF?text=GEC',
        contact_email: 'placement@gec.edu',
        contact_phone: '+1-555-0400',
        website: 'https://gec.edu',
        address: '321 College Road, Engineering City, EC 24680',
        is_verified: true,
        approval_status: 'approved',
        approved_by: null, // Will be updated after users are seeded
        approved_at: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('organizations', null, {});
  }
};
