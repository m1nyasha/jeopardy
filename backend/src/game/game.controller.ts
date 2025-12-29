import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { GameService } from './game.service';

@Controller('api/game')
export class GameController {
  constructor(private gameService: GameService) {}

  @Get('state')
  async getState() {
    return this.gameService.getState();
  }

  @Post('select-question')
  async selectQuestion(@Body() body: { questionId: number }) {
    await this.gameService.selectQuestion(body.questionId);
    return { success: true };
  }

  @Post('answer')
  async playerAnswer(@Body() body: { playerId: number }) {
    return this.gameService.playerAnswer(body.playerId);
  }

  @Post('mark-correct')
  async markCorrect() {
    await this.gameService.markCorrect();
    return { success: true };
  }

  @Post('mark-incorrect')
  async markIncorrect() {
    await this.gameService.markIncorrect();
    return { success: true };
  }

  @Post('show-answer')
  async showAnswer() {
    await this.gameService.showAnswer();
    return { success: true };
  }

  @Post('skip-question')
  async skipQuestion() {
    await this.gameService.skipQuestion();
    return { success: true };
  }

  @Post('reset')
  async resetGame() {
    await this.gameService.resetGame();
    return { success: true };
  }

  @Post('new-game')
  async newGame() {
    await this.gameService.newGame();
    return { success: true };
  }
}

