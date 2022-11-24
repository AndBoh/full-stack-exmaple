import 'dotenv/config';
import { Dialect } from 'sequelize';

import { IDBConfig } from '@Services/DBService/Config/IDBConfig';

const dbConfig: IDBConfig = {
  dialect: process.env.DB_DIALECT as Dialect,
  database: process.env.DB_DATABASE as string,
  host: process.env.DB_HOST as string,
  port: +((process.env.DB_PORT ?? '0') as string),
  username: process.env.DB_USERNAME as string,
  password: process.env.DB_PASSWORD as string,
};

const testConfig: IDBConfig = {
  dialect: 'sqlite',
  storage: ':memory:',
  database: '',
  host: '',
  port: 0,
  username: '',
  password: '',
};

export { dbConfig, testConfig };
