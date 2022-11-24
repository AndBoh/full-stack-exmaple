import { WinstonLogger } from '@Services/LoggerService/Instances/Winston/Winston.logger';
import { AbstractLogger } from '@Services/LoggerService/AbstractLogger';

const ActiveLoggerClass = WinstonLogger;

const loggers: Record<string, AbstractLogger> = {};

class LoggerService {
  public static getLogger(service: string) {
    if (!loggers[service]) {
      loggers[service] = new ActiveLoggerClass(service, process.env[`DEBUG_${service.toUpperCase()}`] === 'true');
    }

    return loggers[service];
  }

  public static clearLoggers() {
    Object.keys(loggers).forEach((loggerKey) => {
      delete loggers[loggerKey];
    });
  }
}

export { LoggerService, ActiveLoggerClass, loggers };
