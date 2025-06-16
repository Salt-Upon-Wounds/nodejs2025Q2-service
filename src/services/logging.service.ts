import { Injectable, LoggerService } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

@Injectable()
export class LoggingService implements LoggerService {
  private logLevel: LogLevel;
  private logFile: string;
  private maxSizeKb: number;

  constructor() {
    this.logLevel = (process.env.LOG_LEVEL as LogLevel) || 'info';
    this.logFile =
      process.env.LOG_FILE || path.join(__dirname, '../../logs/app.log');
    this.maxSizeKb = Number(process.env.LOG_FILE_MAX_KB) || 1000;
    this.rotateLogFileIfNeeded();
  }

  private levels: Record<LogLevel, number> = {
    error: 0,
    warn: 1,
    info: 2,
    debug: 3,
  };

  private shouldLog(level: LogLevel) {
    return this.levels[level] <= this.levels[this.logLevel];
  }

  private ensureLogFileExists() {
    const dir = path.dirname(this.logFile);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    if (!fs.existsSync(this.logFile)) {
      fs.writeFileSync(this.logFile, '');
    }
  }

  private write(message: string) {
    this.ensureLogFileExists();
    this.rotateLogFileIfNeeded();
    fs.appendFileSync(this.logFile, message + '\n');
  }

  private rotateLogFileIfNeeded() {
    if (fs.existsSync(this.logFile)) {
      const stats = fs.statSync(this.logFile);
      if (stats.size > this.maxSizeKb * 1024) {
        const rotated = this.logFile.replace(/\.log$/, `-${Date.now()}.log`);
        fs.renameSync(this.logFile, rotated);
      }
    }
  }

  log(message: string) {
    if (this.shouldLog('info')) {
      const msg = `[INFO] ${new Date().toISOString()} ${message}`;
      this.write(msg);
      process.stdout.write(msg + '\n');
    }
  }

  error(message: string, trace?: string) {
    if (this.shouldLog('error')) {
      const msg = `[ERROR] ${new Date().toISOString()} ${message} ${trace || ''}`;
      this.write(msg);
      process.stderr.write(msg + '\n');
    }
  }

  warn(message: string) {
    if (this.shouldLog('warn')) {
      const msg = `[WARN] ${new Date().toISOString()} ${message}`;
      this.write(msg);
      process.stdout.write(msg + '\n');
    }
  }

  debug(message: string) {
    if (this.shouldLog('debug')) {
      const msg = `[DEBUG] ${new Date().toISOString()} ${message}`;
      this.write(msg);
      process.stdout.write(msg + '\n');
    }
  }
}
