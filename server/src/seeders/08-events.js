// server/src/seeders/08-events.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('events', [
      {
        id: 1,
        organization_id: 1, // Tech University
        title: 'Annual Tech Career Fair 2024',
        description: 'Join us for the biggest tech career fair of the year! Meet top companies, network with industry professionals, and discover exciting career opportunities.',
        event_type: 'job_fair',
        start_time: new Date('2024-03-15T09:00:00Z'),
        end_time: new Date('2024-03-15T17:00:00Z'),
        location: 'Tech University Main Campus, Grand Hall',
        virtual_link: null,
        max_participants: 500,
        registration_deadline: new Date('2024-03-10T23:59:59Z'),
        status: 'scheduled',
        created_by: 2, // TPO Jane Smith
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        organization_id: 1, // Tech University
        title: 'Software Engineering Workshop',
        description: 'Hands-on workshop covering modern software development practices, including Git workflows, CI/CD pipelines, and cloud deployment.',
        event_type: 'workshop',
        start_time: new Date('2024-02-20T14:00:00Z'),
        end_time: new Date('2024-02-20T18:00:00Z'),
        location: 'Tech University, Computer Science Building, Room 101',
        virtual_link: 'https://meet.google.com/abc-defg-hij',
        max_participants: 50,
        registration_deadline: new Date('2024-02-18T23:59:59Z'),
        status: 'scheduled',
        created_by: 2, // TPO Jane Smith
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        organization_id: 2, // TechCorp Industries
        title: 'TechCorp Info Session',
        description: 'Learn about career opportunities at TechCorp Industries. Our team will share insights about our culture, projects, and growth opportunities.',
        event_type: 'info_session',
        start_time: new Date('2024-02-25T16:00:00Z'),
        end_time: new Date('2024-02-25T18:00:00Z'),
        location: 'Tech University, Business School, Auditorium A',
        virtual_link: 'https://zoom.us/j/123456789',
        max_participants: 200,
        registration_deadline: new Date('2024-02-23T23:59:59Z'),
        status: 'scheduled',
        created_by: 3, // Michael Johnson
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        organization_id: 3, // StartupXYZ
        title: 'Startup Innovation Seminar',
        description: 'Discover the world of startups! Learn about entrepreneurship, innovation, and how to build successful tech companies from industry experts.',
        event_type: 'seminar',
        start_time: new Date('2024-03-01T10:00:00Z'),
        end_time: new Date('2024-03-01T12:00:00Z'),
        location: 'Tech University, Innovation Center',
        virtual_link: null,
        max_participants: 100,
        registration_deadline: new Date('2024-02-28T23:59:59Z'),
        status: 'scheduled',
        created_by: 4, // Sarah Williams
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        organization_id: 1, // Tech University
        title: 'Campus Drive - TechCorp Industries',
        description: 'Exclusive campus recruitment drive for final year students. Multiple positions available in software development, data science, and DevOps.',
        event_type: 'campus_drive',
        start_time: new Date('2024-03-10T09:00:00Z'),
        end_time: new Date('2024-03-10T16:00:00Z'),
        location: 'Tech University, Placement Cell',
        virtual_link: null,
        max_participants: 100,
        registration_deadline: new Date('2024-03-05T23:59:59Z'),
        status: 'scheduled',
        created_by: 2, // TPO Jane Smith
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('events', null, {});
  }
};
