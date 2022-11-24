import {
  clearDatabase, expect,
} from '@Tests';

import {
  createFakeId,
  createLogin, createName, createPassword, createRandomString, createUserMock,
} from '@Tests/Mock';

import { AuthService } from '@Services/AuthService/Auth.service';

import {
  ApplicationError, ConflictError, ValidationError, ErrorCode,
} from '@Classes/Error';

import { AccessToken, User } from '@Models';

describe('AuthService', () => {
  beforeEach(clearDatabase);

  describe('registerUser', () => {
    it('Создание юзера с коротким login выбрасывает ошибку ValidationError', (done) => {
      AuthService.registerUser({
        login: createRandomString(2),
        password: createPassword(),
        name: createName(),
      })
        .then(done)
        .catch((error) => {
          expect(error).to.be.instanceof(ValidationError);
          expect(error.httpErrors).to.be.lengthOf(1);
          expect(error.httpErrors[0].type).to.be.eq('len');
          done();
        });
    });

    it('Создание юзера с длинным login выбрасывает ошибку ValidationError', (done) => {
      AuthService.registerUser({
        login: createRandomString(21),
        password: createPassword(),
        name: createName(),
      })
        .then(done)
        .catch((error) => {
          expect(error).to.be.instanceof(ValidationError);
          expect(error.httpErrors).to.be.lengthOf(1);
          expect(error.httpErrors[0].type).to.be.eq('len');
          done();
        });
    });

    it('Создание юзера с login со спецсимволами выбрасывает ошибку ValidationError', (done) => {
      AuthService.registerUser({
        login: `${createLogin()}*`,
        password: createPassword(),
        name: createName(),
      })
        .then(done)
        .catch((error) => {
          expect(error).to.be.instanceof(ValidationError);
          expect(error.httpErrors).to.be.lengthOf(1);
          expect(error.httpErrors[0].type).to.be.eq('is');
          done();
        });
    });

    it('Успешное создание инстанса User', async () => {
      const user = await AuthService.registerUser({
        login: createLogin(),
        password: createPassword(),
        name: createName(),
      });

      expect(user).to.be.instanceof(User);
    });

    it('Создание юзера с существующим login выбрасывает ошибку ConflictError', (done) => {
      createUserMock()
        .then(({ login }) => {
          AuthService.registerUser({
            login,
            password: createPassword(),
            name: createName(),
          })
            .then(done)
            .catch((error) => {
              expect(error).to.be.instanceof(ConflictError);
              done();
            });
        })
        .catch(done);
    });
  });

  describe('loginUser', () => {
    it('Логин юзера c некорректной парой login/password выбрасывает ошибку NOT_FOUND', (done) => {
      createUserMock()
        .then(({ login }) => {
          AuthService.loginUser({
            login,
            password: createPassword(),
          })
            .then(done)
            .catch((error) => {
              expect(error).to.be.instanceof(ApplicationError);
              expect(error.code).to.be.eq(ErrorCode.NOT_FOUND);
              done();
            });
        })
        .catch(done);
    });

    it('Успешная авторизация возвращает инстансы User и AccessToken', async () => {
      const { login, password } = await createUserMock();

      const { user, accessToken } = await AuthService.loginUser({
        login,
        password,
      });

      expect(user).to.be.instanceof(User);
      expect(accessToken).to.be.instanceof(AccessToken);
    });
  });

  describe('logoutUser', () => {
    it('Логаут c невалидным/чужим accessToken возвращает false и не удаляет строки в базе данных', async () => {
      const { user: me, token } = await createUserMock();

      const result = await AuthService.logoutUser({
        me,
        accessToken: createFakeId(),
      });

      const accessToken = await AccessToken.findOne({
        where: {
          token,
        },
      });

      expect(result).to.be.eq(false);
      expect(accessToken).to.be.instanceof(AccessToken);
    });

    it('Логаут c валидным accessToken возвращает true и удаляет его из базы', async () => {
      const { user: me, token } = await createUserMock();

      const result = await AuthService.logoutUser({
        me,
        accessToken: token,
      });

      const accessToken = await AccessToken.findOne({
        where: {
          token,
        },
      });

      expect(result).to.be.eq(true);
      expect(accessToken).to.be.eq(null);
    });
  });

  describe('revokeUserAccessTokens', () => {
    it('Отзыв токенов удаляет все accessToken юзера из базы', async () => {
      const { user: me } = await createUserMock();
      await me.createAccessToken();
      await me.createAccessToken();

      const tokensCountBefore = await AccessToken.count({
        where: {
          userId: me.id,
        },
      });

      expect(tokensCountBefore).to.be.eq(3);

      await AuthService.revokeUserAccessTokens({
        me,
      });

      const tokensCount = await AccessToken.count({
        where: {
          userId: me.id,
        },
      });

      expect(tokensCount).to.be.eq(0);
    });
  });
});
