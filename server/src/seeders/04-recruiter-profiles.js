// server/src/seeders/04-recruiter-profiles.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('recruiter_profiles', [
      {
        id: 1,
        user_id: 3, // Michael Johnson from TechCorp
        department: 'Human Resources',
        position: 'Senior Recruiter',
        bio: 'Experienced HR professional with 8+ years in technical recruitment. Specialized in hiring software engineers and data scientists.',
        experience: 8,
        linkedin_url: 'https://linkedin.com/in/michaeljohnson',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        user_id: 4, // Sarah Williams from StartupXYZ
        department: 'Talent Acquisition',
        position: 'HR Manager',
        bio: 'HR manager with 5+ years experience in startup environments. Passionate about building diverse and inclusive teams.',
        experience: 5,
        linkedin_url: 'https://linkedin.com/in/sarahwilliams',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('recruiter_profiles', null, {});
  }
};
