// server/src/seeders/08-notifications.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('notifications', [
      // Notifications for John Doe
      {
        id: 1,
        user_id: 5,
        title: 'Application Shortlisted',
        message: 'Congratulations! Your application for Software Engineer - Full Stack at TechCorp Industries has been shortlisted. You will be contacted soon for the next round.',
        notification_type: 'application_update',
        is_read: false,
        priority: 'high',
        metadata: JSON.stringify({ jobId: 1, applicationId: 1 }),
        created_at: new Date('2025-08-05'),
        updated_at: new Date('2025-08-05')
      },
      {
        id: 2,
        user_id: 5,
        title: 'New Event: Resume Building Workshop',
        message: 'A new workshop on resume building has been scheduled for August 25th. Register now to improve your resume and increase your chances of getting hired.',
        notification_type: 'event_reminder',
        is_read: true,
        priority: 'medium',
        metadata: JSON.stringify({ eventId: 3 }),
        created_at: new Date('2025-08-20'),
        updated_at: new Date('2025-08-21')
      },
      // Notifications for Alice Wilson
      {
        id: 3,
        user_id: 6,
        title: 'New Job Opportunity',
        message: 'A new DevOps Engineer position has been posted by StartupXYZ. Based on your skills, this might be a great fit for you!',
        notification_type: 'job_alert',
        is_read: false,
        priority: 'medium',
        metadata: JSON.stringify({ jobId: 4 }),
        created_at: new Date('2025-08-12'),
        updated_at: new Date('2025-08-12')
      },
      // Notifications for Emma Davis
      {
        id: 4,
        user_id: 8,
        title: 'Interview Scheduled',
        message: 'Your interview for Data Scientist position at TechCorp Industries has been scheduled for August 15th at 2:00 PM. Please check your email for more details.',
        notification_type: 'application_update',
        is_read: false,
        priority: 'urgent',
        metadata: JSON.stringify({ jobId: 3, applicationId: 3 }),
        created_at: new Date('2025-08-10'),
        updated_at: new Date('2025-08-10')
      },
      // System notifications for all users
      {
        id: 5,
        user_id: 5,
        title: 'Platform Maintenance',
        message: 'The CampusConnect platform will undergo scheduled maintenance on August 30th from 2:00 AM to 4:00 AM. Some features may be temporarily unavailable.',
        notification_type: 'system_alert',
        is_read: false,
        priority: 'low',
        expires_at: new Date('2025-08-31'),
        created_at: new Date('2025-08-28'),
        updated_at: new Date('2025-08-28')
      },
      // Additional notifications for better coverage
      {
        id: 6,
        user_id: 6,
        title: 'Application Status Update',
        message: 'Your application for DevOps Engineer at StartupXYZ has been received and is under review.',
        notification_type: 'application_update',
        is_read: false,
        priority: 'medium',
        metadata: JSON.stringify({ jobId: 4, applicationId: 2 }),
        created_at: new Date('2025-08-13'),
        updated_at: new Date('2025-08-13')
      },
      {
        id: 7,
        user_id: 7,
        title: 'Career Fair Registration Open',
        message: 'Registration for the Annual Tech Career Fair is now open. Connect with top employers and explore exciting opportunities.',
        notification_type: 'event_reminder',
        is_read: false,
        priority: 'medium',
        metadata: JSON.stringify({ eventId: 1 }),
        created_at: new Date('2025-08-08'),
        updated_at: new Date('2025-08-08')
      },
      {
        id: 8,
        user_id: 8,
        title: 'Profile Update Required',
        message: 'Please update your profile with your latest academic achievements to improve your job matching.',
        notification_type: 'system_alert',
        is_read: true,
        priority: 'low',
        created_at: new Date('2025-08-01'),
        updated_at: new Date('2025-08-02')
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notifications', null, {});
  }
};