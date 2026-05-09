import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

 // backend/src/main.ts
app.enableCors({ origin: ['http://localhost:5173', 'http://localhost:5174'] });

  await app.listen(3000);
  console.log('Backend Click2Print running on http://localhost:3000');
}
bootstrap();