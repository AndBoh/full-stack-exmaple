import {
  clearDatabase, expect, requestServer,
} from '@Tests';

import { createFakeId, createUserMock } from '@Tests/Mock';

describe('/api', () => {
  describe('GET /me', () => {
    beforeEach(clearDatabase);

    it('Запрос без accessToken отдает 401', async () => {
      const { status } = await requestServer()
        .get('/api/me');

      expect(status).to.be.eq(401);
    });

    it('Запрос c несуществующим accessToken отдает 401', async () => {
      const { status } = await requestServer()
        .get('/api/me')
        .set('Cookie', `accessToken=${createFakeId()}`);

      expect(status).to.be.eq(401);
    });

    it('Запрос с валидным accessToken отдает 200', async () => {
      const { token, user: me } = await createUserMock();

      const { status, body } = await requestServer()
        .get('/api/me')
        .set('Cookie', `accessToken=${token}`);

      expect(status).to.be.eq(200);

      expect(body).to.have.property('id');
      expect(body).to.have.property('login');
      expect(body).to.have.property('name');
      expect(body).not.to.have.property('password');
      expect(body.id).to.be.eq(me.id);
    });
  });
});
