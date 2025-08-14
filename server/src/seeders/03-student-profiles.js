// server/src/seeders/03-student-profiles.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('student_profiles', [
      {
        id: 1,
        user_id: 5, // John Doe
        student_id: 'TU2021001',
        date_of_birth: '2000-05-15',
        gender: 'male',
        course: 'Bachelor of Technology',
        branch: 'Computer Science Engineering',
        year_of_study: 4,
        graduation_year: 2025,
        cgpa: 8.5,
        percentage: 85.0,
        address: '123 Student St, Tech City, TC 12345',
        skills: JSON.stringify(['JavaScript', 'React', 'Node.js', 'Python', 'SQL', 'Git']),
        bio: 'Passionate computer science student with strong problem-solving skills and experience in full-stack web development. Eager to contribute to innovative projects and learn new technologies.',
        linkedin_url: 'https://linkedin.com/in/bobmartinez',
        github_url: 'https://github.com/bobmartinez',
        is_eligible: true,
        placement_status: 'unplaced',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        user_id: 8, // Emma Davis
        student_id: 'TU2021003',
        date_of_birth: '2001-07-12',
        gender: 'female',
        course: 'Bachelor of Technology',
        branch: 'Computer Science Engineering',
        year_of_study: 4,
        graduation_year: 2025,
        cgpa: 8.9,
        percentage: 89.0,
        address: '321 Scholar St, Tech City, TC 12345',
        skills: JSON.stringify(['Python', 'Machine Learning', 'TensorFlow', 'Data Science', 'R', 'SQL']),
        bio: 'Computer science student specializing in artificial intelligence and machine learning. Strong mathematical background with experience in data analysis and predictive modeling.',
        linkedin_url: 'https://linkedin.com/in/emmadavis',
        github_url: 'https://github.com/emmadavis',
        portfolio_url: 'https://emmadavis.ai',
        is_eligible: true,
        placement_status: 'unplaced',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('student_profiles', null, {});
  }
};