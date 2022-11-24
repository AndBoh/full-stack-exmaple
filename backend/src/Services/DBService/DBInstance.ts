import { Sequelize } from 'sequelize';

import { LoggerService } from '@Services/LoggerService/Logger.service';
import { IDBConfig } from '@Services/DBService/Config/IDBConfig';

class DBInstance {
  public readonly instance: Sequelize;

  constructor(
    private config: IDBConfig,
  ) {
    this.instance = new Sequelize(config.database, config.username, config.password, {
      host: config.host,
      port: config.port,
      dialect: config.dialect,
      logging: (sql) => LoggerService.getLogger('DBService').log('debug', `${sql}`),
    });
  }

  public get sequelize() {
    return this.instance;
  }

  public testConnection() {
    return this.instance.authenticate();
  }
}

export { DBInstance };
