import chai from 'chai';
import chaiHttp from 'chai-http';
import { server } from '@index';
import { faker } from '@faker-js/faker';

import { DBService } from '@Services/DBService/DB.service';

const { expect } = chai;

chai.use(chaiHttp);
faker.locale = 'ru';

const requestServer = () => chai.request(server);

const clearDatabase = () => DBService.getInstance().sync(true);

const closeDatabase = () => DBService.getInstance().sequelize.close();

export {
  expect,
  requestServer,
  clearDatabase,
  closeDatabase,
  server,
  faker,
};
