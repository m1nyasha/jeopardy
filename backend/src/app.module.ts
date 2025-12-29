import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { existsSync } from 'fs';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { GameModule } from './game/game.module';
import { PlayersModule } from './players/players.module';
import { QuestionsModule } from './questions/questions.module';

// В Docker изображения монтируются в /app/public/images
// В dev режиме они в корне проекта ../images
const getImagesPath = () => {
  const dockerPath = join(__dirname, '..', '..', 'public', 'images');
  const devPath = join(__dirname, '..', '..', '..', 'images');
  
  if (existsSync(dockerPath)) {
    return dockerPath;
  }
  return devPath;
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ServeStaticModule.forRoot({
      rootPath: getImagesPath(),
      serveRoot: '/images',
      serveStaticOptions: {
        index: false,
      },
    }),
    PrismaModule,
    AuthModule,
    GameModule,
    PlayersModule,
    QuestionsModule,
  ],
})
export class AppModule {}

