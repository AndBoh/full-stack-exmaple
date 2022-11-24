import { LogLevel } from '@Services/LoggerService/Logger.types';
import { ApplicationError } from '@Classes/Error/ApplicationError';

const isTest = process.env.NODE_ENV === 'test';

abstract class AbstractLogger {
  protected constructor(
    protected service: string,
    protected debugMode: boolean,
    private isSilent: boolean = isTest,
  ) {
  }

  abstract log(level: LogLevel, message: string): void;

  private tryToLog(level: LogLevel, message: string) {
    if (!this.isSilent) {
      this.log(level, message);
    }
  }

  private logAndThrow(method: 'error' | 'warning' | 'info' | 'debug', messageOrError: string | ApplicationError) {
    if (typeof messageOrError === 'string') {
      return this.tryToLog(method, messageOrError);
    }

    if (messageOrError.loggerMessage) {
      this[method](messageOrError.loggerMessage);
    }

    throw messageOrError;
  }

  public info(message: string): void;
  public info(error: ApplicationError): never;
  public info(messageOrError: string | ApplicationError) {
    this.logAndThrow('info', messageOrError);
  }

  public warning(message: string): void;
  public warning(error: ApplicationError): never;
  public warning(messageOrError: string | ApplicationError) {
    this.logAndThrow('warning', messageOrError);
  }

  public error(message: string): void;
  public error(error: ApplicationError): never;
  public error(messageOrError: string | ApplicationError) {
    this.logAndThrow('error', messageOrError);
  }

  public debug(message: string): void;
  public debug(error: ApplicationError): never;
  public debug(messageOrError: string | ApplicationError) {
    this.logAndThrow('debug', messageOrError);
  }
}

export { AbstractLogger };
