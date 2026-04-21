import {
  Injectable,
  NotFoundException,
  InternalServerErrorException,
  BadRequestException,
} from '@nestjs/common';
import { QuestionType } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

@Injectable()
export class QuizService {
  constructor(private readonly prisma: PrismaService) {}

  async createQuiz(data: { title: string; questions: any[] }) {
    const { title, questions } = data;
    if (!title || typeof title !== 'string') {
      throw new BadRequestException('Title is required');
    }
    if (!Array.isArray(questions) || questions.length === 0) {
      throw new BadRequestException('Questions array is required');
    }
    for (const q of questions) {
      if (!q.text || typeof q.text !== 'string') {
        throw new BadRequestException('Each question must have text');
      }
      if (!q.type || !Object.values(QuestionType).includes(q.type)) {
        throw new BadRequestException('Invalid question type');
      }
    }
    try {
      const quiz = await this.prisma.quiz.create({
        data: {
          title,
          questions: {
            create: questions.map((q) => ({
              text: q.text,
              type: q.type,
              options: q.options ?? null,
              correctAnswers: q.correctAnswers ?? null,
            })),
          },
        },
        include: { questions: true },
      });
      return quiz;
    } catch (e) {
      throw new InternalServerErrorException('Failed to create quiz');
    }
  }

  async getAllQuizzes() {
    try {
      const quizzes = await this.prisma.quiz.findMany({
        select: {
          id: true,
          title: true,
          questions: { select: { id: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
      return quizzes.map((q) => ({
        id: q.id,
        title: q.title,
        questionsCount: q.questions.length,
      }));
    } catch (e) {
      throw new InternalServerErrorException('Failed to fetch quizzes');
    }
  }

  async getQuizById(id: string) {
    try {
      const quiz = await this.prisma.quiz.findUnique({
        where: { id },
        include: { questions: true },
      });
      if (!quiz) throw new NotFoundException('Quiz not found');
      return quiz;
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Failed to fetch quiz');
    }
  }

  async deleteQuiz(id: string) {
    try {
      const quiz = await this.prisma.quiz.findUnique({ where: { id } });
      if (!quiz) throw new NotFoundException('Quiz not found');
      await this.prisma.quiz.delete({ where: { id } });
      return { message: 'Quiz deleted' };
    } catch (e) {
      if (e instanceof NotFoundException) throw e;
      throw new InternalServerErrorException('Failed to delete quiz');
    }
  }
}
