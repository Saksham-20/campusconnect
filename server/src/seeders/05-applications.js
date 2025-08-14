// server/src/seeders/05-applications.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('applications', [
      {
        id: 1,
        job_id: 1, // Software Engineer - Full Stack
        student_id: 5, // John Doe
        cover_letter: 'I am excited to apply for the Software Engineer position at TechCorp. My experience with JavaScript, React, and Node.js makes me a perfect fit for this role.',
        status: 'shortlisted',
        applied_at: new Date('2025-08-01'),
        shortlisted_at: new Date('2025-08-05'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        job_id: 2, // Frontend Developer Intern
        student_id: 6, // Alice Wilson
        cover_letter: 'I would love to contribute to StartupXYZ as a Frontend Developer Intern. My strong foundation in React and passion for learning new technologies align well with your requirements.',
        status: 'applied',
        applied_at: new Date('2025-08-03'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        job_id: 3, // Data Scientist
        student_id: 8, // Emma Davis
        cover_letter: 'As a Computer Science student specializing in AI and ML, I am thrilled to apply for the Data Scientist position. My experience with Python, TensorFlow, and statistical analysis makes me an ideal candidate.',
        status: 'interviewed',
        applied_at: new Date('2025-07-28'),
        shortlisted_at: new Date('2025-08-02'),
        interviewed_at: new Date('2025-08-10'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        job_id: 1, // Software Engineer - Full Stack
        student_id: 8, // Emma Davis
        cover_letter: 'I am interested in applying my programming skills to full-stack development. My strong background in computer science and experience with various technologies make me a great fit.',
        status: 'applied',
        applied_at: new Date('2025-08-05'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        job_id: 4, // DevOps Engineer
        student_id: 6, // Alice Wilson
        cover_letter: 'My experience with cloud technologies and containerization makes me excited about the DevOps Engineer position at StartupXYZ.',
        status: 'screening',
        applied_at: new Date('2025-08-08'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('applications', null, {});
  }
};