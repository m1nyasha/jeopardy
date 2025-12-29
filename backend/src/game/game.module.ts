import { Module } from '@nestjs/common';
import { GameController } from './game.controller';
import { GameService } from './game.service';
import { PlayersModule } from '../players/players.module';
import { QuestionsModule } from '../questions/questions.module';

@Module({
  imports: [PlayersModule, QuestionsModule],
  controllers: [GameController],
  providers: [GameService],
})
export class GameModule {}

