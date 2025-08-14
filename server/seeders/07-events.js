// server/src/seeders/07-events.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('events', [
      {
        id: 1,
        organization_id: 2, // TechCorp Industries
        title: 'TechCorp Campus Recruitment Drive 2025',
        description: 'Join us for our annual campus recruitment drive. We will be conducting technical interviews and assessments for multiple positions including Software Engineer, Data Scientist, and DevOps roles.',
        event_type: 'campus_drive',
        start_time: new Date('2025-09-15 09:00:00'),
        end_time: new Date('2025-09-15 17:00:00'),
        location: 'Tech University, Main Auditorium',
        max_participants: 100,
        registration_deadline: new Date('2025-09-10'),
        status: 'scheduled',
        created_by: 3, // Recruiter at TechCorp
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        organization_id: 3, // StartupXYZ
        title: 'StartupXYZ Information Session',
        description: 'Learn about career opportunities at StartupXYZ, our company culture, and the exciting projects you could work on. This session will include a Q&A with our engineering team.',
        event_type: 'info_session',
        start_time: new Date('2025-09-05 14:00:00'),
        end_time: new Date('2025-09-05 16:00:00'),
        location: 'Tech University, Room 201',
        max_participants: 50,
        registration_deadline: new Date('2025-09-03'),
        status: 'scheduled',
        created_by: 4, // Recruiter at StartupXYZ
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        organization_id: 1, // Tech University
        title: 'Resume Building Workshop',
        description: 'Learn how to create an effective resume that stands out to recruiters. This workshop will cover resume formatting, key skills highlighting, and common mistakes to avoid.',
        event_type: 'workshop',
        start_time: new Date('2025-08-25 10:00:00'),
        end_time: new Date('2025-08-25 12:00:00'),
        location: 'Tech University, Career Center',
        max_participants: 75,
        registration_deadline: new Date('2025-08-23'),
        status: 'scheduled',
        created_by: 2, // TPO
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        organization_id: 1, // Tech University
        title: 'Mock Interview Session',
        description: 'Practice your interview skills with industry professionals. Get personalized feedback on your technical and behavioral interview performance.',
        event_type: 'workshop',
        start_time: new Date('2025-09-20 13:00:00'),
        end_time: new Date('2025-09-20 17:00:00'),
        location: 'Tech University, Interview Rooms',
        max_participants: 30,
        registration_deadline: new Date('2025-09-18'),
        status: 'scheduled',
        created_by: 2, // TPO
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('events', null, {});
  }
};