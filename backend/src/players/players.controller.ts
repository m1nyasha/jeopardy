import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { PlayersService } from './players.service';

@Controller('api/players')
export class PlayersController {
  constructor(private playersService: PlayersService) {}

  @Post('join')
  async join(@Body() body: { name: string }) {
    const player = await this.playersService.findOrCreate(body.name);
    return player;
  }

  @Get()
  async findAll() {
    return this.playersService.findAll();
  }

  @Get(':id')
  async findById(@Param('id') id: string) {
    return this.playersService.findById(parseInt(id));
  }

  @Patch(':id/score')
  async updateScore(
    @Param('id') id: string,
    @Body() body: { scoreChange: number },
  ) {
    return this.playersService.updateScore(parseInt(id), body.scoreChange);
  }

  @Patch(':id/set-score')
  async setScore(
    @Param('id') id: string,
    @Body() body: { score: number },
  ) {
    return this.playersService.setScore(parseInt(id), body.score);
  }
}

