// server/src/seeders/04-jobs.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('jobs', [
      {
        id: 1,
        organization_id: 2, // TechCorp Industries
        title: 'Software Engineer - Full Stack',
        description: 'We are looking for a talented Full Stack Developer to join our dynamic team. You will be responsible for developing and maintaining web applications using modern technologies.',
        requirements: 'Bachelor\'s degree in Computer Science or related field. Strong knowledge of JavaScript, React, Node.js, and databases. Experience with cloud platforms is a plus.',
        job_type: 'full_time',
        location: 'San Francisco, CA (Hybrid)',
        salary_min: 80000,
        salary_max: 120000,
        experience_required: 0,
        skills_required: JSON.stringify(['JavaScript', 'React', 'Node.js', 'SQL', 'Git']),
        total_positions: 3,
        application_deadline: new Date('2025-12-31'),
        status: 'active',
        eligibility_criteria: JSON.stringify({
          minCGPA: 7.0,
          allowedBranches: ['Computer Science Engineering', 'Information Technology'],
          graduationYear: 2025
        }),
        created_by: 3, // Recruiter at TechCorp
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        organization_id: 3, // StartupXYZ
        title: 'Frontend Developer Intern',
        description: 'Join our startup as a Frontend Developer Intern! Work on cutting-edge projects and gain hands-on experience with modern web technologies.',
        requirements: 'Currently pursuing a degree in Computer Science, IT, or related field. Knowledge of HTML, CSS, JavaScript, and React. Eager to learn and adapt.',
        job_type: 'internship',
        location: 'Remote',
        salary_min: 2000,
        salary_max: 3000,
        experience_required: 0,
        skills_required: JSON.stringify(['HTML', 'CSS', 'JavaScript', 'React']),
        total_positions: 2,
        application_deadline: new Date('2025-11-30'),
        status: 'active',
        eligibility_criteria: JSON.stringify({
          minCGPA: 6.5,
          allowedBranches: ['Computer Science Engineering', 'Information Technology', 'Electronics and Communication'],
          graduationYear: 2025
        }),
        created_by: 4, // Recruiter at StartupXYZ
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        organization_id: 2, // TechCorp Industries
        title: 'Data Scientist',
        description: 'Looking for a Data Scientist to analyze complex datasets and build predictive models. You will work with cross-functional teams to derive insights from data.',
        requirements: 'Master\'s degree in Data Science, Statistics, or related field preferred. Strong knowledge of Python, R, machine learning algorithms, and statistical analysis.',
        job_type: 'full_time',
        location: 'New York, NY',
        salary_min: 90000,
        salary_max: 140000,
        experience_required: 1,
        skills_required: JSON.stringify(['Python', 'R', 'Machine Learning', 'SQL', 'Statistics']),
        total_positions: 1,
        application_deadline: new Date('2025-12-15'),
        status: 'active',
        eligibility_criteria: JSON.stringify({
          minCGPA: 8.0,
          allowedBranches: ['Computer Science Engineering', 'Information Technology'],
          graduationYear: 2025
        }),
        created_by: 3, // Recruiter at TechCorp
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        organization_id: 3, // StartupXYZ
        title: 'DevOps Engineer',
        description: 'Join our DevOps team to build and maintain CI/CD pipelines, manage cloud infrastructure, and ensure system reliability.',
        requirements: 'Bachelor\'s degree in Computer Science or related field. Experience with Docker, Kubernetes, AWS/Azure, and automation tools.',
        job_type: 'full_time',
        location: 'Austin, TX',
        salary_min: 75000,
        salary_max: 110000,
        experience_required: 0,
        skills_required: JSON.stringify(['Docker', 'Kubernetes', 'AWS', 'Linux', 'Python']),
        total_positions: 2,
        application_deadline: new Date('2026-01-15'),
        status: 'active',
        eligibility_criteria: JSON.stringify({
          minCGPA: 7.5,
          allowedBranches: ['Computer Science Engineering', 'Information Technology'],
          graduationYear: 2025
        }),
        created_by: 4, // Recruiter at StartupXYZ
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('jobs', null, {});
  }
};