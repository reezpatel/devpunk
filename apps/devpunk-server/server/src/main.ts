import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { ValidationPipe } from '@nestjs/common';
import * as helmet from 'helmet';
import { join } from 'path';
import { APP_CONFIG } from './app/config';

const { DATA_PATH, DATA_FOLDER } = APP_CONFIG;

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  const globalPrefix = 'v1';

  app.use(helmet());
  app.setGlobalPrefix(globalPrefix);
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true })
  );
  // app.useStaticAssets(join(DATA_PATH, DATA_FOLDER), {
  //   prefix: '/v1/static'
  // });

  const port = process.env.port || 3333;
  await app.listen(port, () => {
    console.log('Listening at Port: ' + port + '/' + globalPrefix);
  });
}

bootstrap();
