// server/src/seeders/13-files.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('files', [
      {
        id: 1,
        user_id: 5, // John Doe
        filename: 'john_doe_resume.pdf',
        original_name: 'resume.pdf',
        mime_type: 'application/pdf',
        file_size: 245760, // 240 KB
        file_path: '/uploads/resumes/john_doe_resume.pdf',
        file_type: 'resume',
        is_public: false,
        metadata: JSON.stringify({
          uploaded_for: 'job_application',
          job_id: 1
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        user_id: 6, // Alice Wilson
        filename: 'alice_wilson_resume.pdf',
        original_name: 'alice_resume.pdf',
        mime_type: 'application/pdf',
        file_size: 198400, // 194 KB
        file_path: '/uploads/resumes/alice_wilson_resume.pdf',
        file_type: 'resume',
        is_public: false,
        metadata: JSON.stringify({
          uploaded_for: 'job_application',
          job_id: 2
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        user_id: 7, // Bob Martinez
        filename: 'bob_martinez_resume.pdf',
        original_name: 'bob_resume.pdf',
        mime_type: 'application/pdf',
        file_size: 312320, // 305 KB
        file_path: '/uploads/resumes/bob_martinez_resume.pdf',
        file_type: 'resume',
        is_public: false,
        metadata: JSON.stringify({
          uploaded_for: 'job_application',
          job_id: 3
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        user_id: 8, // Emma Davis
        filename: 'emma_davis_resume.pdf',
        original_name: 'emma_resume.pdf',
        mime_type: 'application/pdf',
        file_size: 225280, // 220 KB
        file_path: '/uploads/resumes/emma_davis_resume.pdf',
        file_type: 'resume',
        is_public: false,
        metadata: JSON.stringify({
          uploaded_for: 'job_application',
          job_id: 4
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        user_id: 5, // John Doe
        filename: 'john_doe_profile.jpg',
        original_name: 'profile.jpg',
        mime_type: 'image/jpeg',
        file_size: 51200, // 50 KB
        file_path: '/uploads/profile_pictures/john_doe_profile.jpg',
        file_type: 'profile_picture',
        is_public: true,
        metadata: JSON.stringify({
          dimensions: '200x200',
          uploaded_for: 'profile_picture'
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('files', null, {});
  }
};
