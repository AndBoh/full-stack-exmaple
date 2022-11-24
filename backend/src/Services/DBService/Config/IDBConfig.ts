import { Dialect } from 'sequelize';

export interface IDBConfig {
  dialect: Dialect,
  host: string,
  port: number,
  database: string,
  username: string,
  password: string,
  storage?: string,
}
