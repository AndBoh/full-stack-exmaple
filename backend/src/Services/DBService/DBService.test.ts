import { Sequelize } from 'sequelize';

import { expect } from '@Tests';

import { DBService } from '@Services/DBService/DB.service';
import { dbConfig } from '@Services/DBService/Config/DBConfig';

describe('DBService', () => {
  it('Подключение к базе данных из ENV', async () => {
    // @ts-ignore
    const db = new DBService(dbConfig);
    await db.testConnection();
    await db.sequelize.close();
  });

  it('Подключение к тестовой базе данных SQLite', async () => {
    // @ts-ignore
    const db = new DBService();
    await db.testConnection();
    await db.sequelize.close();
  });

  describe('getInstance', () => {
    it('Получение инстанса базы данных возвращает синглтон', () => {
      const instance1 = DBService.getInstance();
      const instance2 = DBService.getInstance();

      expect(instance1).to.be.instanceof(DBService);
      expect(instance1 === instance2).to.be.eq(true);
    });

    describe('sequelize', () => {
      it('Получение инстанса sequelize из сервиса', () => {
        expect(DBService.getInstance().sequelize).to.be.instanceof(Sequelize);
      });
    });

    describe('sync', () => {
      it('Sync не выбрасывает ошибку', async () => {
        await DBService.getInstance().sync(true);
      });
    });
  });
});
