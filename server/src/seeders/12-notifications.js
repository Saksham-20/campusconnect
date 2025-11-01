// server/src/seeders/12-notifications.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('notifications', [
      {
        id: 1,
        user_id: 5, // John Doe
        title: 'Application Status Updated',
        message: 'Your application for Software Engineer position at TechCorp has been shortlisted. Please check your email for next steps.',
        notification_type: 'application_update',
        is_read: false,
        priority: 'high',
        metadata: JSON.stringify({
          application_id: 1,
          job_title: 'Software Engineer',
          company: 'TechCorp Industries',
          status: 'shortlisted'
        }),
        expires_at: new Date('2024-12-31T23:59:59Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        user_id: 6, // Alice Wilson
        title: 'New Job Opportunity',
        message: 'A new Data Scientist Intern position has been posted by TechCorp Industries. This role matches your profile perfectly!',
        notification_type: 'job_alert',
        is_read: false,
        priority: 'medium',
        metadata: JSON.stringify({
          job_id: 2,
          job_title: 'Data Scientist Intern',
          company: 'TechCorp Industries',
          match_score: 95
        }),
        expires_at: new Date('2024-05-31T23:59:59Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        user_id: 5, // John Doe
        title: 'Event Reminder',
        message: 'Reminder: Annual Tech Career Fair 2024 is tomorrow at 9:00 AM. Don\'t forget to bring your resume and business cards!',
        notification_type: 'event_reminder',
        is_read: false,
        priority: 'high',
        metadata: JSON.stringify({
          event_id: 1,
          event_title: 'Annual Tech Career Fair 2024',
          event_time: '2024-03-15T09:00:00Z',
          location: 'Tech University Main Campus, Grand Hall'
        }),
        expires_at: new Date('2024-03-16T23:59:59Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        user_id: 6, // Alice Wilson
        title: 'Assessment Invitation',
        message: 'You have been invited to take the Data Science Assessment for TechCorp Industries. Please complete it within 48 hours.',
        notification_type: 'system_alert',
        is_read: false,
        priority: 'urgent',
        metadata: JSON.stringify({
          assessment_id: 2,
          assessment_title: 'Data Science Assessment',
          company: 'TechCorp Industries',
          deadline: '2024-02-09T23:59:59Z'
        }),
        expires_at: new Date('2024-02-09T23:59:59Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        user_id: 7, // Bob Martinez
        title: 'Welcome to EduMapping',
        message: 'Welcome to EduMapping! Complete your profile to get personalized job recommendations and connect with top companies.',
        notification_type: 'general',
        is_read: false,
        priority: 'low',
        metadata: JSON.stringify({
          action_required: 'complete_profile',
          profile_completion: 65
        }),
        expires_at: new Date('2024-12-31T23:59:59Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        user_id: 8, // Emma Davis
        title: 'Application Submitted Successfully',
        message: 'Your application for Product Manager Intern at StartupXYZ has been submitted successfully. You will receive updates on your application status.',
        notification_type: 'application_update',
        is_read: false,
        priority: 'medium',
        metadata: JSON.stringify({
          application_id: 5,
          job_title: 'Product Manager Intern',
          company: 'StartupXYZ',
          status: 'applied',
          applied_at: '2024-01-12T10:00:00Z'
        }),
        expires_at: new Date('2024-12-31T23:59:59Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 7,
        user_id: 5, // John Doe
        title: 'Interview Scheduled',
        message: 'Your interview for the Software Engineer position at TechCorp has been scheduled for March 20th, 2024 at 2:00 PM.',
        notification_type: 'application_update',
        is_read: false,
        priority: 'high',
        metadata: JSON.stringify({
          application_id: 1,
          job_title: 'Software Engineer',
          company: 'TechCorp Industries',
          interview_date: '2024-03-20T14:00:00Z',
          interview_type: 'technical'
        }),
        expires_at: new Date('2024-03-21T23:59:59Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 8,
        user_id: 2, // TPO Jane Smith
        title: 'New Company Registration',
        message: 'A new company, InnovationTech, has registered on the platform. Please review and verify their profile.',
        notification_type: 'system_alert',
        is_read: false,
        priority: 'medium',
        metadata: JSON.stringify({
          company_name: 'InnovationTech',
          registration_date: '2024-02-01T10:00:00Z',
          action_required: 'verify_company'
        }),
        expires_at: new Date('2024-12-31T23:59:59Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 9,
        user_id: 3, // Michael Johnson
        title: 'New Application Received',
        message: 'A new application has been received for the Software Engineer position. Please review the candidate profile.',
        notification_type: 'application_update',
        is_read: false,
        priority: 'medium',
        metadata: JSON.stringify({
          application_id: 2,
          candidate_name: 'Alice Wilson',
          job_title: 'Software Engineer',
          application_date: '2024-01-16T14:30:00Z'
        }),
        expires_at: new Date('2024-12-31T23:59:59Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 10,
        user_id: 4, // Sarah Williams
        title: 'Event Registration Update',
        message: 'The Startup Innovation Seminar has reached 80% capacity. Consider increasing the venue size or adding a virtual option.',
        notification_type: 'system_alert',
        is_read: false,
        priority: 'medium',
        metadata: JSON.stringify({
          event_id: 4,
          event_title: 'Startup Innovation Seminar',
          current_registrations: 80,
          max_capacity: 100,
          registration_percentage: 80
        }),
        expires_at: new Date('2024-12-31T23:59:59Z'),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('notifications', null, {});
  }
};
