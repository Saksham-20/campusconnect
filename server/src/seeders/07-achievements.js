// server/src/seeders/07-achievements.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('achievements', [
      {
        id: 1,
        user_id: 5, // John Doe
        title: 'First Place - Hackathon 2024',
        description: 'Won first place in the annual university hackathon for developing an innovative task management application using React and Node.js.',
        achievement_type: 'competition',
        issuing_organization: 'Tech University',
        issue_date: '2024-01-15',
        credential_url: 'https://example.com/certificates/hackathon_winner.pdf',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        user_id: 5, // John Doe
        title: 'AWS Certified Developer - Associate',
        description: 'Successfully completed AWS certification demonstrating proficiency in cloud development and deployment.',
        achievement_type: 'certification',
        issuing_organization: 'Amazon Web Services',
        issue_date: '2023-11-20',
        expiry_date: '2026-11-20',
        credential_url: 'https://aws.amazon.com/certification/',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        user_id: 6, // Alice Wilson
        title: 'Best Research Paper - Data Science Conference',
        description: 'Presented research paper on "Machine Learning Applications in Healthcare" at the International Data Science Conference.',
        achievement_type: 'publication',
        issuing_organization: 'International Data Science Society',
        issue_date: '2023-09-10',
        credential_url: 'https://example.com/papers/healthcare_ml.pdf',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        user_id: 6, // Alice Wilson
        title: 'Dean\'s List - Fall 2023',
        description: 'Achieved academic excellence with a GPA of 9.0, earning a place on the Dean\'s List.',
        achievement_type: 'academic',
        issuing_organization: 'Tech University',
        issue_date: '2023-12-15',
        credential_url: 'https://example.com/certificates/deans_list.pdf',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        user_id: 7, // Bob Martinez
        title: 'Renewable Energy Project Award',
        description: 'Received recognition for outstanding project on "Solar Power Integration in Smart Grids" in the Engineering Department.',
        achievement_type: 'project',
        issuing_organization: 'Global Engineering College',
        issue_date: '2023-10-05',
        credential_url: 'https://example.com/certificates/renewable_energy.pdf',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        user_id: 8, // Emma Davis
        title: 'Machine Learning Research Grant',
        description: 'Awarded research grant for developing computer vision algorithms for medical image analysis.',
        achievement_type: 'academic',
        issuing_organization: 'Tech University Research Foundation',
        issue_date: '2024-01-10',
        credential_url: 'https://example.com/certificates/research_grant.pdf',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        user_id: 8, // Emma Davis
        title: 'Kaggle Competition Winner',
        description: 'Achieved top 5% ranking in Kaggle competition for image classification using deep learning techniques.',
        achievement_type: 'competition',
        issuing_organization: 'Kaggle',
        issue_date: '2023-12-01',
        credential_url: 'https://www.kaggle.com/competitions/example',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('achievements', null, {});
  }
};
