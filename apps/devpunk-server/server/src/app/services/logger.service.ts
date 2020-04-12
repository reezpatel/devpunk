import { LoggerService } from '@nestjs/common';

export class Logger implements LoggerService {
  private print(severity, context, ...message) {
    console[severity](
      `[${context}]`,
      ...message.map(m => {
        if (m instanceof Error) {
          return m.message;
        }
        try {
          return JSON.parse(m);
        } catch (_) {
          return m;
        }
      })
    );
  }

  log(message: any, context?: string) {
    this.print('log', message);
  }
  error(message: any, trace?: string, context?: string) {
    this.print('error', message, trace);
  }
  warn(message: any, context?: string) {
    this.print('warn', message);
  }
  debug?(message: any, context?: string) {
    this.print('debug', message);
  }
  verbose?(message: any, context?: string) {
    this.print('info', message);
  }
}
