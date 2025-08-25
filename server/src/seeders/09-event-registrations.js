// server/src/seeders/09-event-registrations.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('event_registrations', [
      {
        id: 1,
        event_id: 1, // Annual Tech Career Fair 2024
        user_id: 5, // John Doe
        status: 'registered',
        registered_at: new Date('2024-01-20T10:00:00Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        event_id: 1, // Annual Tech Career Fair 2024
        user_id: 6, // Alice Wilson
        status: 'registered',
        registered_at: new Date('2024-01-21T14:30:00Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        event_id: 1, // Annual Tech Career Fair 2024
        user_id: 7, // Bob Martinez
        status: 'registered',
        registered_at: new Date('2024-01-22T09:15:00Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        event_id: 1, // Annual Tech Career Fair 2024
        user_id: 8, // Emma Davis
        status: 'registered',
        registered_at: new Date('2024-01-23T16:45:00Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        event_id: 2, // Software Engineering Workshop
        user_id: 5, // John Doe
        status: 'registered',
        registered_at: new Date('2024-01-25T11:20:00Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        event_id: 2, // Software Engineering Workshop
        user_id: 6, // Alice Wilson
        status: 'registered',
        registered_at: new Date('2024-01-26T13:10:00Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        event_id: 3, // TechCorp Info Session
        user_id: 5, // John Doe
        status: 'registered',
        registered_at: new Date('2024-01-28T15:30:00Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 8,
        event_id: 3, // TechCorp Info Session
        user_id: 6, // Alice Wilson
        status: 'registered',
        registered_at: new Date('2024-01-29T10:45:00Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 9,
        event_id: 4, // Startup Innovation Seminar
        user_id: 8, // Emma Davis
        status: 'registered',
        registered_at: new Date('2024-01-30T12:00:00Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 10,
        event_id: 5, // Campus Drive - TechCorp Industries
        user_id: 5, // John Doe
        status: 'registered',
        registered_at: new Date('2024-02-01T09:00:00Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 11,
        event_id: 5, // Campus Drive - TechCorp Industries
        user_id: 6, // Alice Wilson
        status: 'registered',
        registered_at: new Date('2024-02-02T14:20:00Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 12,
        event_id: 5, // Campus Drive - TechCorp Industries
        user_id: 8, // Emma Davis
        status: 'registered',
        registered_at: new Date('2024-02-03T11:15:00Z'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('event_registrations', null, {});
  }
};
