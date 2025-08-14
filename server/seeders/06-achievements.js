// server/src/seeders/06-achievements.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('achievements', [
      // John Doe's achievements
      {
        id: 1,
        user_id: 5,
        title: 'Winner - University Hackathon 2024',
        description: 'Led a team of 4 developers to build a sustainable energy management system using IoT sensors and machine learning algorithms. Won first place among 50+ teams.',
        achievement_type: 'competition',
        issuing_organization: 'Tech University',
        issue_date: '2024-03-15',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        user_id: 5,
        title: 'Full-Stack Web Development Certification',
        description: 'Completed comprehensive certification covering React, Node.js, Express, MongoDB, and deployment strategies.',
        achievement_type: 'certification',
        issuing_organization: 'FreeCodeCamp',
        issue_date: '2024-01-20',
        credential_url: 'https://freecodecamp.org/certification/johndoe/full-stack',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        user_id: 5,
        title: 'E-Commerce Platform Development',
        description: 'Developed a complete e-commerce platform with user authentication, payment integration, inventory management, and order tracking. Implemented using React, Node.js, and PostgreSQL.',
        achievement_type: 'project',
        issue_date: '2024-05-10',
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Alice Wilson's achievements
      {
        id: 4,
        user_id: 6,
        title: 'AWS Certified Solutions Architect',
        description: 'Achieved AWS Solutions Architect Associate certification demonstrating expertise in designing distributed systems on AWS.',
        achievement_type: 'certification',
        issuing_organization: 'Amazon Web Services',
        issue_date: '2024-02-28',
        expiry_date: '2027-02-28',
        credential_url: 'https://aws.amazon.com/verification',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        user_id: 6,
        title: 'Dean\'s List - Academic Excellence',
        description: 'Achieved Dean\'s List recognition for maintaining a CGPA of 9.2+ for three consecutive semesters.',
        achievement_type: 'academic',
        issuing_organization: 'Tech University',
        issue_date: '2024-06-15',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        user_id: 6,
        title: 'Microservices Architecture with Docker',
        description: 'Built a scalable microservices application using Spring Boot, Docker, Kubernetes, and implemented CI/CD pipeline with Jenkins.',
        achievement_type: 'project',
        issue_date: '2024-04-20',
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Bob Martinez's achievements
      {
        id: 7,
        user_id: 7,
        title: 'IoT Smart Home System',
        description: 'Designed and implemented a complete IoT-based smart home automation system using Arduino, sensors, and mobile app integration.',
        achievement_type: 'project',
        issue_date: '2024-03-30',
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 8,
        user_id: 7,
        title: 'MATLAB Certified Associate',
        description: 'Completed MATLAB certification focusing on signal processing and control systems design.',
        achievement_type: 'certification',
        issuing_organization: 'MathWorks',
        issue_date: '2024-01-15',
        credential_url: 'https://mathworks.com/certification',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      // Emma Davis's achievements
      {
        id: 9,
        user_id: 8,
        title: 'Machine Learning Research Publication',
        description: 'Co-authored research paper on "Predictive Analytics for Student Performance" published in IEEE conference proceedings.',
        achievement_type: 'publication',
        issuing_organization: 'IEEE',
        issue_date: '2024-04-10',
        credential_url: 'https://ieeexplore.ieee.org/document/example',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 10,
        user_id: 8,
        title: 'Google TensorFlow Developer Certificate',
        description: 'Earned TensorFlow Developer Certificate demonstrating proficiency in building and training neural networks using TensorFlow.',
        achievement_type: 'certification',
        issuing_organization: 'Google',
        issue_date: '2024-05-25',
        expiry_date: '2027-05-25',
        credential_url: 'https://tensorflow.org/certificate',
        is_verified: true,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 11,
        user_id: 8,
        title: 'Predictive Analytics Dashboard',
        description: 'Developed a comprehensive analytics dashboard for predicting student academic performance using machine learning algorithms and real-time data visualization.',
        achievement_type: 'project',
        issue_date: '2024-06-30',
        is_verified: false,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('achievements', null, {});
  }
};