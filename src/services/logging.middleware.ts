import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { LoggingService } from './logging.service';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  constructor(private logger: LoggingService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const { method, url, query, body } = req;
    this.logger.log(
      `Request: ${method} ${url} | query: ${JSON.stringify(query)} | body: ${JSON.stringify(body)}`,
    );

    const oldSend = res.send;
    res.send = (...args: any[]) => {
      this.logger.log(`Response: ${method} ${url} | status: ${res.statusCode}`);
      return oldSend.apply(res, args);
    };
    next();
  }
}
