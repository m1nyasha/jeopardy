import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class QuestionsService {
  constructor(private prisma: PrismaService) {}

  async findAllCategories() {
    return this.prisma.category.findMany({
      include: {
        questions: {
          orderBy: { points: 'asc' },
        },
      },
    });
  }

  async findQuestionById(id: number) {
    return this.prisma.question.findUnique({
      where: { id },
      include: { category: true },
    });
  }

  async markAsAnswered(id: number) {
    return this.prisma.question.update({
      where: { id },
      data: { isAnswered: true },
    });
  }

  async resetAllQuestions() {
    return this.prisma.question.updateMany({
      data: { isAnswered: false },
    });
  }

  async countUnanswered() {
    return this.prisma.question.count({
      where: { isAnswered: false },
    });
  }
}

