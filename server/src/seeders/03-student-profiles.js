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
        linkedin_url: 'https://linkedin.com/in/johndoe',
        github_url: 'https://github.com/johndoe',
        portfolio_url: 'https://johndoe.dev',
        resume_url: 'https://example.com/resume1.pdf',
        is_eligible: true,
        placement_status: 'unplaced',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        user_id: 6, // Alice Wilson
        student_id: 'TU2021002',
        date_of_birth: '2001-03-20',
        gender: 'female',
        course: 'Bachelor of Technology',
        branch: 'Computer Science Engineering',
        year_of_study: 3,
        graduation_year: 2026,
        cgpa: 8.8,
        percentage: 88.0,
        address: '456 Student Ave, Tech City, TC 12345',
        skills: JSON.stringify(['Python', 'Machine Learning', 'SQL', 'R', 'Data Analysis']),
        bio: 'Data science enthusiast with strong analytical skills and passion for machine learning algorithms.',
        linkedin_url: 'https://linkedin.com/in/alicewilson',
        github_url: 'https://github.com/alicewilson',
        portfolio_url: 'https://alicewilson.dev',
        resume_url: 'https://example.com/resume2.pdf',
        is_eligible: true,
        placement_status: 'unplaced',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        user_id: 7, // Bob Martinez
        student_id: 'GEC2020001',
        date_of_birth: '1999-11-10',
        gender: 'male',
        course: 'Bachelor of Technology',
        branch: 'Electrical Engineering',
        year_of_study: 4,
        graduation_year: 2024,
        cgpa: 7.8,
        percentage: 78.0,
        address: '789 Student Blvd, Engineering City, EC 24680',
        skills: JSON.stringify(['MATLAB', 'AutoCAD', 'Circuit Design', 'Power Systems']),
        bio: 'Electrical engineering student with focus on renewable energy and power systems design.',
        linkedin_url: 'https://linkedin.com/in/bobmartinez',
        github_url: 'https://github.com/bobmartinez',
        portfolio_url: 'https://bobmartinez.dev',
        resume_url: 'https://example.com/resume3.pdf',
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
        resume_url: 'https://example.com/resume4.pdf',
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