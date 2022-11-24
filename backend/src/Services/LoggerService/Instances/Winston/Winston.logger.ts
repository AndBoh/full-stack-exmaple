import * as path from 'path';
import DailyRotateFile from 'winston-daily-rotate-file';
import {
  Logger, createLogger, format, transports,
} from 'winston';

import { AbstractLogger } from '@Services/LoggerService/AbstractLogger';
import { LogLevel } from '@Services/LoggerService/Logger.types';
import { debugFormatter } from '@Services/LoggerService/Instances/Winston/DebugFormatter';

const {
  combine, timestamp, json, label,
} = format;

const fileLogFormat = combine(
  timestamp(),
  json(),
);

class WinstonLogger extends AbstractLogger {
  logger: Logger;

  constructor(service: string, debug: boolean) {
    super(service, debug);

    this.logger = createLogger({
      format: fileLogFormat,
      transports: WinstonLogger.getServiceFileTransports(service),
    });

    if (this.debugMode) {
      this.logger.add(WinstonLogger.getServiceConsoleTransport(service));
    }
  }

  log(level: LogLevel, message: string) {
    this.logger.log({
      level,
      message,
    });
  }

  static getServiceConsoleTransport(service: string) {
    const consoleLogFormat = combine(
      label({ label: service }),
      format.timestamp({
        format: 'YYYY-MM-DD HH:mm:ss',
      }),
      debugFormatter(),
      format.simple(),
    );

    return new transports.Console({
      level: 'debug',
      format: consoleLogFormat,
    });
  }

  static getServiceFileTransports(service: string) {
    const logFilename = path.resolve(process.cwd(), `logs/${service}/${service}-%DATE%.log`);
    const errorLogFilename = path.resolve(process.cwd(), `logs/${service}/${service}-%DATE%.error.log`);

    return [
      new DailyRotateFile({
        level: 'info',
        filename: logFilename,
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      }),
      new DailyRotateFile({
        level: 'error',
        filename: errorLogFilename,
        datePattern: 'YYYY-MM-DD-HH',
        zippedArchive: true,
        maxSize: '20m',
        maxFiles: '14d',
      }),
    ];
  }
}

export { WinstonLogger };
