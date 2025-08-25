// server/src/seeders/11-assessment-results.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('assessment_results', [
      {
        id: 1,
        assessment_id: 1, // Technical Assessment - Full Stack Development
        student_id: 5, // John Doe
        answers: JSON.stringify([
          {
            question_id: 1,
            answer: 0, // Correct answer for useEffect question
            is_correct: true,
            time_spent: 30
          },
          {
            question_id: 2,
            answer: 'function reverseString(str) {\n  return str.split("").reverse().join("");\n}',
            is_correct: true,
            time_spent: 1800
          }
        ]),
        score: 30,
        percentage: 30.0,
        time_spent: 90,
        started_at: new Date('2024-02-05T10:00:00Z'),
        submitted_at: new Date('2024-02-05T11:30:00Z'),
        status: 'completed',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        assessment_id: 1, // Technical Assessment - Full Stack Development
        student_id: 6, // Alice Wilson
        answers: JSON.stringify([
          {
            question_id: 1,
            answer: 0, // Correct answer for useEffect question
            is_correct: true,
            time_spent: 25
          },
          {
            question_id: 2,
            answer: 'function reverseString(str) {\n  return str.split("").reverse().join("");\n}',
            is_correct: true,
            time_spent: 2400
          }
        ]),
        score: 30,
        percentage: 30.0,
        time_spent: 110,
        started_at: new Date('2024-02-06T14:00:00Z'),
        submitted_at: new Date('2024-02-06T15:50:00Z'),
        status: 'completed',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        assessment_id: 2, // Data Science Assessment
        student_id: 6, // Alice Wilson
        answers: JSON.stringify([
          {
            question_id: 1,
            answer: 0, // Correct answer for overfitting question
            is_correct: true,
            time_spent: 20
          }
        ]),
        score: 15,
        percentage: 15.0,
        time_spent: 75,
        started_at: new Date('2024-02-07T09:00:00Z'),
        submitted_at: new Date('2024-02-07T10:15:00Z'),
        status: 'completed',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 4,
        assessment_id: 3, // Frontend Development Assessment
        student_id: 5, // John Doe
        answers: JSON.stringify([
          {
            question_id: 1,
            answer: '<nav class="navbar">...</nav>',
            is_correct: true,
            time_spent: 900
          },
          {
            question_id: 2,
            answer: 'function validateForm() {\n  // Form validation logic\n  return true;\n}',
            is_correct: true,
            time_spent: 1800
          }
        ]),
        score: 100,
        percentage: 100.0,
        time_spent: 55,
        started_at: new Date('2024-02-08T13:00:00Z'),
        submitted_at: new Date('2024-02-08T13:55:00Z'),
        status: 'completed',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 5,
        assessment_id: 2, // Data Science Assessment
        student_id: 7, // Bob Martinez
        answers: JSON.stringify([
          {
            question_id: 1,
            answer: 0, // Correct answer for overfitting question
            is_correct: true,
            time_spent: 45
          }
        ]),
        score: 15,
        percentage: 15.0,
        time_spent: 50,
        started_at: new Date('2024-02-09T11:00:00Z'),
        submitted_at: new Date('2024-02-09T11:50:00Z'),
        status: 'completed',
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 6,
        assessment_id: 3, // Frontend Development Assessment
        student_id: 8, // Emma Davis
        answers: JSON.stringify([
          {
            question_id: 1,
            answer: '<nav class="navbar">...</nav>',
            is_correct: true,
            time_spent: 40
          },
          {
            question_id: 2,
            answer: 'function validateForm() {\n  // Form validation logic\n  return true;\n}',
            is_correct: true,
            time_spent: 280
          }
        ]),
        score: 100,
        percentage: 100.0,
        time_spent: 45,
        started_at: new Date('2024-02-10T15:00:00Z'),
        submitted_at: new Date('2024-02-10T15:45:00Z'),
        status: 'completed',
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('assessment_results', null, {});
  }
};
