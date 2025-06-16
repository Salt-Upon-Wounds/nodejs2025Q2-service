import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as SwaggerUI from 'swagger-ui-express';
import * as YAML from 'yamljs';
import { join } from 'path';
import { LoggingService } from './services/logging.service';
import { LoggingMiddleware } from './services/logging.middleware';
import { AllExceptionsFilter } from './services/all-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = app.get(LoggingService);
  process.on('uncaughtException', (err) => {
    logger.error('Uncaught Exception', err.stack);
  });
  process.on('unhandledRejection', (reason: any) => {
    logger.error('Unhandled Rejection', reason?.stack || String(reason));
  });
  app.useLogger(logger);
  app.useGlobalFilters(new AllExceptionsFilter(app.get(LoggingService)));
  app.use(
    '/doc',
    SwaggerUI.serve,
    SwaggerUI.setup(YAML.load(join(__dirname, '..', 'doc', 'api.yaml'))),
    new LoggingMiddleware(logger).use,
  );
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  await app.listen(process.env.PORT || 4000, '0.0.0.0');
}
bootstrap();
