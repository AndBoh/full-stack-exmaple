import { LoggerService } from '@Services/LoggerService/Logger.service';
import { DBInstance } from '@Services/DBService/DBInstance';
import { dbConfig, testConfig } from '@Services/DBService/Config/DBConfig';

import { ApplicationError } from '@Classes/Error';

const isTest = process.env.NODE_ENV === 'test';
const defaultConfig = isTest ? testConfig : dbConfig;

const logger = LoggerService.getLogger('DBService');

let instance: DBService;

class DBService {
  private db: DBInstance;

  private constructor(config = defaultConfig) {
    this.db = new DBInstance(config);
  }

  public get sequelize() {
    return this.db.sequelize;
  }

  public static getInstance(): DBService {
    if (!instance) {
      try {
        instance = new DBService();
      } catch (e) {
        logger.error(new ApplicationError((e as Error).message));
      }
    }

    return instance;
  }

  public async testConnection() {
    await this.db.testConnection();
    logger.info('Successfully connected to database');
  }

  async sync(force: boolean = false) {
    await this.sequelize.sync({ force });
    logger.debug('Database sync success');
  }
}

export { DBService };
