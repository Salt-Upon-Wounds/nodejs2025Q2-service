import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as SwaggerUI from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(
    '/doc',
    SwaggerUI.serve,
    SwaggerUI.setup(YAML.load(join(__dirname, '..', 'doc', 'api.yaml'))),
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT || 4000, '0.0.0.0');
}
bootstrap();
