import { expect } from '@Tests';

import { LoggerService, loggers, ActiveLoggerClass } from '@Services/LoggerService/Logger.service';

const loggerKey = 'Test';

describe(`LoggerService - ${ActiveLoggerClass.name}`, () => {
  describe('getLogger', () => {
    it('Успешное создание логгера', () => {
      LoggerService.getLogger(loggerKey);

      expect(loggers).to.have.property(loggerKey);
      expect(loggers[loggerKey]).to.be.instanceof(ActiveLoggerClass);
    });

    it('Логгер имеет методы log, info, warning, error, debug', () => {
      expect(typeof loggers[loggerKey].log).to.be.eq('function');
      expect(typeof loggers[loggerKey].info).to.be.eq('function');
      expect(typeof loggers[loggerKey].warning).to.be.eq('function');
      expect(typeof loggers[loggerKey].error).to.be.eq('function');
      expect(typeof loggers[loggerKey].debug).to.be.eq('function');
    });
  });

  describe('clearLoggers', () => {
    it('Успешное удаление всех логгеров', () => {
      LoggerService.clearLoggers();

      expect(Object.values(loggers)).to.be.lengthOf(0);
    });
  });
});
