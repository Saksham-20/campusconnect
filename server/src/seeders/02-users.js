
// server/src/seeders/02-users.js
'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface, Sequelize) {
    const passwordHash = await bcrypt.hash('password123', 12);
    
    await queryInterface.bulkInsert('users', [
      // Admin user
      {
        id: 1,
        email: 'admin@campusconnect.com',
        password_hash: passwordHash,
        role: 'admin',
        first_name: 'System',
        last_name: 'Administrator',
        phone: '+1-555-0001',
        organization_id: null,
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // TPO user
      {
        id: 2,
        email: 'tpo@techuniversity.edu',
        password_hash: passwordHash,
        role: 'tpo',
        first_name: 'Jane',
        last_name: 'Smith',
        phone: '+1-555-0002',
        organization_id: 1,
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Recruiter users
      {
        id: 3,
        email: 'recruiter@techcorp.com',
        password_hash: passwordHash,
        role: 'recruiter',
        first_name: 'Michael',
        last_name: 'Johnson',
        phone: '+1-555-0003',
        organization_id: 2,
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        email: 'hr@startupxyz.io',
        password_hash: passwordHash,
        role: 'recruiter',
        first_name: 'Sarah',
        last_name: 'Williams',
        phone: '+1-555-0004',
        organization_id: 3,
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Student users
      {
        id: 5,
        email: 'john.doe@techuniversity.edu',
        password_hash: passwordHash,
        role: 'student',
        first_name: 'John',
        last_name: 'Doe',
        phone: '+1-555-0005',
        organization_id: 1,
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        email: 'alice.wilson@techuniversity.edu',
        password_hash: passwordHash,
        role: 'student',
        first_name: 'Alice',
        last_name: 'Wilson',
        phone: '+1-555-0006',
        organization_id: 1,
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        email: 'bob.martinez@gec.edu',
        password_hash: passwordHash,
        role: 'student',
        first_name: 'Bob',
        last_name: 'Martinez',
        phone: '+1-555-0007',
        organization_id: 4,
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 8,
        email: 'emma.davis@techuniversity.edu',
        password_hash: passwordHash,
        role: 'student',
        first_name: 'Emma',
        last_name: 'Davis',
        phone: '+1-555-0008',
        organization_id: 1,
        is_active: true,
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', null, {});
  }
};
