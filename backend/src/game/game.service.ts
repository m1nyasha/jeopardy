import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PlayersService } from '../players/players.service';
import { QuestionsService } from '../questions/questions.service';

@Injectable()
export class GameService {
  constructor(
    private prisma: PrismaService,
    private playersService: PlayersService,
    private questionsService: QuestionsService,
  ) {}

  async getState() {
    const state = await this.prisma.gameState.findFirst();
    if (!state) {
      return this.prisma.gameState.create({
        data: { status: 'waiting' },
      });
    }

    let currentQuestion = null;
    let currentPlayer = null;

    if (state.currentQuestionId) {
      currentQuestion = await this.questionsService.findQuestionById(state.currentQuestionId);
    }

    if (state.currentPlayerId) {
      currentPlayer = await this.playersService.findById(state.currentPlayerId);
    }

    const categories = await this.questionsService.findAllCategories();
    const players = await this.playersService.findAll();
    const unansweredCount = await this.questionsService.countUnanswered();

    return {
      ...state,
      failedPlayerIds: JSON.parse(state.failedPlayerIds),
      currentQuestion,
      currentPlayer,
      categories,
      players,
      isGameOver: unansweredCount === 0 && state.status === 'waiting',
    };
  }

  async selectQuestion(questionId: number) {
    const question = await this.questionsService.findQuestionById(questionId);
    if (!question || question.isAnswered) {
      throw new Error('Question not available');
    }

    return this.prisma.gameState.updateMany({
      data: {
        status: 'question',
        currentQuestionId: questionId,
        currentPlayerId: null,
        showAnswer: false,
        failedPlayerIds: '[]',
      },
    });
  }

  async playerAnswer(playerId: number) {
    const state = await this.prisma.gameState.findFirst();
    if (!state || state.status !== 'question') {
      return { success: false, message: 'Нельзя ответить сейчас' };
    }

    // Если ответ уже показан — нельзя отвечать
    if (state.showAnswer) {
      return { success: false, message: 'Ответ уже показан' };
    }

    const failedIds = JSON.parse(state.failedPlayerIds) as number[];
    if (failedIds.includes(playerId)) {
      return { success: false, message: 'Вы уже отвечали на этот вопрос' };
    }

    if (state.currentPlayerId) {
      return { success: false, message: 'Другой игрок уже отвечает' };
    }

    await this.prisma.gameState.updateMany({
      data: {
        status: 'answering',
        currentPlayerId: playerId,
      },
    });

    return { success: true };
  }

  async markCorrect() {
    const state = await this.prisma.gameState.findFirst();
    if (!state || !state.currentPlayerId || !state.currentQuestionId) {
      throw new Error('Invalid state');
    }

    const question = await this.questionsService.findQuestionById(state.currentQuestionId);
    await this.playersService.updateScore(state.currentPlayerId, question.points);
    await this.questionsService.markAsAnswered(state.currentQuestionId);

    // Показываем ответ, но не переходим к таблице — ждём "Следующий вопрос"
    return this.prisma.gameState.updateMany({
      data: {
        status: 'question',
        currentPlayerId: null,
        showAnswer: true,
      },
    });
  }

  async markIncorrect() {
    const state = await this.prisma.gameState.findFirst();
    if (!state || !state.currentPlayerId || !state.currentQuestionId) {
      throw new Error('Invalid state');
    }

    const question = await this.questionsService.findQuestionById(state.currentQuestionId);
    await this.playersService.updateScore(state.currentPlayerId, -question.points);

    const failedIds = JSON.parse(state.failedPlayerIds) as number[];
    failedIds.push(state.currentPlayerId);

    return this.prisma.gameState.updateMany({
      data: {
        status: 'question',
        currentPlayerId: null,
        failedPlayerIds: JSON.stringify(failedIds),
      },
    });
  }

  async showAnswer() {
    return this.prisma.gameState.updateMany({
      data: { showAnswer: true },
    });
  }

  async skipQuestion() {
    const state = await this.prisma.gameState.findFirst();
    if (state?.currentQuestionId) {
      await this.questionsService.markAsAnswered(state.currentQuestionId);
    }

    return this.prisma.gameState.updateMany({
      data: {
        status: 'waiting',
        currentQuestionId: null,
        currentPlayerId: null,
        showAnswer: false,
        failedPlayerIds: '[]',
      },
    });
  }

  async resetGame() {
    await this.questionsService.resetAllQuestions();
    await this.playersService.resetAllScores();

    return this.prisma.gameState.updateMany({
      data: {
        status: 'waiting',
        currentQuestionId: null,
        currentPlayerId: null,
        showAnswer: false,
        failedPlayerIds: '[]',
      },
    });
  }

  async newGame() {
    await this.questionsService.resetAllQuestions();
    await this.playersService.deleteAll();

    return this.prisma.gameState.updateMany({
      data: {
        status: 'waiting',
        currentQuestionId: null,
        currentPlayerId: null,
        showAnswer: false,
        failedPlayerIds: '[]',
      },
    });
  }
}

