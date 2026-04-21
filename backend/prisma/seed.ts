import 'dotenv/config';
import { PrismaClient, QuestionType, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

// Используем встроенные типы Prisma для обеспечения 100% совместимости
const seedQuizzes: Prisma.QuizCreateInput[] = [
  {
    title: 'Frontend foundations',
    questions: {
      create: [
        {
          text: 'HTML is a semantic markup language.',
          type: QuestionType.BOOLEAN,
          options: ['True', 'False'],
          correctAnswers: ['True'],
        },
        {
          text: 'What hook is used for local component state in React?',
          type: QuestionType.INPUT,
          options: Prisma.JsonNull, // Используем JsonNull для корректной типизации JSON полей
          correctAnswers: ['useState'],
        },
        {
          text: 'Select CSS layout systems commonly used for one-dimensional and two-dimensional layouts.',
          type: QuestionType.CHECKBOX,
          options: ['Flexbox', 'Grid', 'Atomic CSS', 'Cascade'],
          correctAnswers: ['Flexbox', 'Grid'],
        },
      ],
    },
  },
  {
    title: 'Product logic snapshot',
    questions: {
      create: [
        {
          text: 'Guests should be able to view published quizzes.',
          type: QuestionType.BOOLEAN,
          options: ['True', 'False'],
          correctAnswers: ['True'],
        },
        {
          text: 'Name the database-safe identifier format used in the backend.',
          type: QuestionType.INPUT,
          options: Prisma.JsonNull,
          correctAnswers: ['UUID'],
        },
        {
          text: 'Select the states the dashboard should support.',
          type: QuestionType.CHECKBOX,
          options: ['Loading', 'Empty', 'Error', 'Archived'],
          correctAnswers: ['Loading', 'Empty', 'Error'],
        },
      ],
    },
  },
];

async function main() {
  // Очистка БД (в порядке, учитывающем связи)
  await prisma.question.deleteMany();
  await prisma.quiz.deleteMany();

  console.log('Start seeding...');

  for (const data of seedQuizzes) {
    const quiz = await prisma.quiz.create({
      data,
    });
    console.log(`Created quiz with id: ${quiz.id}`);
  }

  console.log(`Seeding finished. Created ${seedQuizzes.length} quizzes.`);
}

main()
  .catch((error: unknown) => {
    console.error('Database seed failed.');
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
