// server/src/seeders/14-audit-logs.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('audit_logs', [
      {
        id: 1,
        user_id: 1, // System Administrator
        action: 'CREATE',
        entity_type: 'organization',
        entity_id: 1,
        old_values: null,
        new_values: JSON.stringify({
          name: 'Tech University',
          type: 'university',
          domain: 'techuniversity.edu'
        }),
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        created_at: new Date('2024-01-01T09:00:00Z')
      },
      {
        id: 2,
        user_id: 1, // System Administrator
        action: 'CREATE',
        entity_type: 'user',
        entity_id: 2,
        old_values: null,
        new_values: JSON.stringify({
          email: 'tpo@techuniversity.edu',
          role: 'tpo',
          first_name: 'Jane',
          last_name: 'Smith'
        }),
        ip_address: '192.168.1.100',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        created_at: new Date('2024-01-01T09:15:00Z')
      },
      {
        id: 3,
        user_id: 2, // TPO Jane Smith
        action: 'CREATE',
        entity_type: 'job',
        entity_id: 1,
        old_values: null,
        new_values: JSON.stringify({
          title: 'Software Engineer - Full Stack',
          organization_id: 2,
          status: 'active'
        }),
        ip_address: '192.168.1.101',
        user_agent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
        created_at: new Date('2024-01-02T10:00:00Z')
      },
      {
        id: 4,
        user_id: 5, // John Doe
        action: 'UPDATE',
        entity_type: 'student_profile',
        entity_id: 1,
        old_values: JSON.stringify({
          cgpa: 8.3,
          skills: ['JavaScript', 'React', 'Node.js']
        }),
        new_values: JSON.stringify({
          cgpa: 8.5,
          skills: ['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git']
        }),
        ip_address: '192.168.1.102',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        created_at: new Date('2024-01-03T14:30:00Z')
      },
      {
        id: 5,
        user_id: 3, // Michael Johnson
        action: 'CREATE',
        entity_type: 'assessment',
        entity_id: 1,
        old_values: null,
        new_values: JSON.stringify({
          title: 'Technical Assessment - Full Stack Development',
          job_id: 1,
          assessment_type: 'technical'
        }),
        ip_address: '192.168.1.103',
        user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        created_at: new Date('2024-01-04T11:00:00Z')
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('audit_logs', null, {});
  }
};
