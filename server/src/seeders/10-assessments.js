// server/src/seeders/10-assessments.js
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('assessments', [
      {
        id: 1,
        job_id: 1, // Software Engineer at TechCorp
        title: 'Technical Assessment - Full Stack Development',
        description: 'Comprehensive technical assessment covering JavaScript, React, Node.js, and database concepts.',
        assessment_type: 'technical',
        duration: 120, // 2 hours
        total_marks: 100,
        passing_marks: 70,
        questions: JSON.stringify([
          {
            id: 1,
            type: 'multiple_choice',
            question: 'What is the purpose of useEffect in React?',
            options: [
              'To handle side effects in functional components',
              'To create new components',
              'To handle routing',
              'To manage state'
            ],
            correct_answer: 0,
            marks: 10
          },
          {
            id: 2,
            type: 'coding',
            question: 'Write a function to reverse a string in JavaScript',
            marks: 20
          }
        ]),
        instructions: 'Please complete this assessment within the allocated time. Ensure your code is clean and well-commented.',
        is_active: true,
        start_time: new Date('2024-02-01T09:00:00Z'),
        end_time: new Date('2024-02-01T17:00:00Z'),
        created_by: 3, // Michael Johnson
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        job_id: 2, // Data Scientist Intern at TechCorp
        title: 'Data Science Assessment',
        description: 'Assessment covering Python, R, machine learning concepts, and statistical analysis.',
        assessment_type: 'technical',
        duration: 90, // 1.5 hours
        total_marks: 100,
        passing_marks: 65,
        questions: JSON.stringify([
          {
            id: 1,
            type: 'multiple_choice',
            question: 'What is overfitting in machine learning?',
            options: [
              'When a model performs well on training data but poorly on test data',
              'When a model is too simple',
              'When a model has too few parameters',
              'When a model is too slow'
            ],
            correct_answer: 0,
            marks: 15
          }
        ]),
        instructions: 'Answer all questions to the best of your ability. Show your work for calculation problems.',
        is_active: true,
        start_time: new Date('2024-02-02T10:00:00Z'),
        end_time: new Date('2024-02-02T16:00:00Z'),
        created_by: 3, // Michael Johnson
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 3,
        job_id: 3, // Frontend Developer at StartupXYZ
        title: 'Frontend Development Assessment',
        description: 'Assessment covering HTML, CSS, JavaScript, and modern frontend frameworks.',
        assessment_type: 'coding',
        duration: 60, // 1 hour
        total_marks: 100,
        passing_marks: 75,
        questions: JSON.stringify([
          {
            id: 1,
            type: 'coding',
            question: 'Create a responsive navigation bar using HTML and CSS',
            marks: 50
          },
          {
            id: 2,
            type: 'coding',
            question: 'Write a JavaScript function to handle form validation',
            marks: 50
          }
        ]),
        instructions: 'Create clean, responsive code. Test your solutions in a browser.',
        is_active: true,
        start_time: new Date('2024-02-03T14:00:00Z'),
        end_time: new Date('2024-02-03T18:00:00Z'),
        created_by: 4, // Sarah Williams
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('assessments', null, {});
  }
};
