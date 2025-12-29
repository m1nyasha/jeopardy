import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    origin: true,
    credentials: true,
  });
  
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
  }));
  
  const port = process.env.PORT || 3001;
  await app.listen(port, '0.0.0.0');
  console.log(`🎄 Svoya Igra Backend running on http://0.0.0.0:${port}`);
  console.log(`📱 Access from other devices: http://<your-ip>:${port}`);
}
bootstrap();

