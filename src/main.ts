import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const port = 3000;
  const externalRootPath = 'api/attendance-system';

  app.setGlobalPrefix(externalRootPath);
  app.enableCors({
    origin: 'http://localhost:4200',
  });

  await app.listen(port);

  console.debug(`Listening on port - ${port}`);
}

bootstrap();
