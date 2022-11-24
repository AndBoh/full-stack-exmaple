import { clearDatabase, expect } from '@Tests';

import { createFakeId, createUserMock } from '@Tests/Mock';

import UserService from '@Services/UserService/User.service';

import { User } from '@Models';

import { ApplicationError, NotFoundError } from '@Classes/Error';

describe('UserService', () => {
  beforeEach(clearDatabase);

  describe('getUser', () => {
    it('Запрос несуществующего юзера выбрасывает ошибку NotFoundError', (done) => {
      createUserMock()
        .then(({ user: me }) => {
          UserService.getUser({
            me,
            id: createFakeId(),
          })
            .then(done)
            .catch((error) => {
              expect(error).to.be.instanceof(NotFoundError);
              done();
            });
        })
        .catch(done);
    });

    it('Запрос другого юзера отдает инстанс User без связей', async () => {
      const { user: me } = await createUserMock();
      const { user } = await createUserMock();

      const foundUser = await UserService.getUser({
        id: user.id,
        me,
      });

      expect(foundUser).to.be.instanceof(User);
      expect(foundUser.id).to.be.eq(user.id);
      expect(foundUser).to.not.have.property('companies');
      expect(foundUser).to.not.have.property('projects');
    });

    it('Запрос себя отдает инстанс User со связями', async () => {
      const { user: me } = await createUserMock();

      const foundUser = await UserService.getUser({
        id: me.id,
        me,
      });

      expect(foundUser).to.be.instanceof(User);
      expect(foundUser.id).to.be.eq(me.id);
      expect(foundUser).to.have.property('companies');
      expect(foundUser).to.have.property('projects');
    });
  });

  describe('getUserByAccessToken', () => {
    it('Запрос юзера c невалидным accessToken выбрасывает ошибку ApplicationError', (done) => {
      const fakeToken = createFakeId();

      UserService.getUserByAccessToken({
        accessToken: fakeToken,
      })
        .then(done)
        .catch((error) => {
          expect(error).to.be.instanceof(ApplicationError);
          expect(error.loggerMessage).to.include(fakeToken);
          done();
        });
    });

    it('Запрос c валидным accessToken отдает инстанс User со связями', async () => {
      const { token, user: me } = await createUserMock();

      const foundUser = await UserService.getUserByAccessToken({
        accessToken: token,
      });

      expect(foundUser).to.be.instanceof(User);
      expect(foundUser!.id).to.be.eq(me.id);
      expect(foundUser).to.have.property('companies');
      expect(foundUser).to.have.property('projects');
    });
  });
});
