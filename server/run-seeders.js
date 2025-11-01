#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

console.log('🌱 Starting EduMapping Database Seeding...\n');

const seeders = [
  '01-organizations.js',
  '02-users.js',
  '03-student-profiles.js',
  '04-recruiter-profiles.js',
  '05-jobs.js',
  '06-applications.js',
  '07-achievements.js',
  '08-events.js',
  '09-event-registrations.js',
  '10-assessments.js',
  '11-assessment-results.js',
  '12-notifications.js',
  '13-files.js',
  '14-audit-logs.js'
];

async function runSeeders() {
  try {
    // First, run migrations to ensure database structure is up to date
    console.log('📊 Running database migrations...');
    execSync('npx sequelize-cli db:migrate', { stdio: 'inherit' });
    console.log('✅ Migrations completed successfully!\n');

    // Run all seeders in order
    for (const seeder of seeders) {
      console.log(`🌱 Running seeder: ${seeder}`);
      try {
        execSync(`npx sequelize-cli db:seed --seed ${seeder}`, { stdio: 'inherit' });
        console.log(`✅ ${seeder} completed successfully!\n`);
      } catch (error) {
        console.error(`❌ Error running ${seeder}:`, error.message);
        process.exit(1);
      }
    }

    console.log('🎉 All seeders completed successfully!');
    console.log('\n📋 Summary of data created:');
    console.log('   • 8 Organizations (4 Universities, 4 Companies)');
    console.log('   • 16 Users (1 Admin, 3 TPOs, 4 Recruiters, 8 Students)');
    console.log('   • 8 Student Profiles with comprehensive skills');
    console.log('   • 4 Recruiter Profiles with specialization details');
    console.log('   • 8 Job Postings across different roles and companies');
    console.log('   • 12 Job Applications with various statuses');
    console.log('   • 20 Student Achievements and certifications');
    console.log('   • 10 Events and workshops');
    console.log('   • 22 Event Registrations');
    console.log('   • 8 Assessment types');
    console.log('   • 14 Assessment Results');
    console.log('   • 20 System Notifications');
    console.log('   • 12 File uploads (resumes, projects, research)');
    console.log('   • 15 Audit Log entries');
    
    console.log('\n🚀 Your EduMapping platform is now populated with comprehensive dummy data!');
    console.log('📖 Check README-DUMMY-DATA.md for detailed information about all features.');
    console.log('📸 Perfect for taking screenshots and college presentations!');

  } catch (error) {
    console.error('❌ Error during seeding process:', error.message);
    process.exit(1);
  }
}

// Check if we're in the right directory
if (!require('fs').existsSync(path.join(__dirname, 'package.json'))) {
  console.error('❌ Please run this script from the server directory');
  process.exit(1);
}

runSeeders();
