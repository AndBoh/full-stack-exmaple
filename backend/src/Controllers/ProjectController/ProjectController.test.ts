import {
  clearDatabase, expect, requestServer,
} from '@Tests';

import {
  createFakeId, createProjectMock,
} from '@Tests/Mock';

describe('/project', () => {
  beforeEach(clearDatabase);

  describe('GET /:id', () => {
    it('Запрос без accessToken отдает 401', async () => {
      const { project } = await createProjectMock();

      const { status } = await requestServer()
        .get(`/api/project/${project.id}`);

      expect(status).to.be.eq(401);
    });

    it('Запрос с не корректным id отдает 404', async () => {
      const { token } = await createProjectMock();

      const fakeId = createFakeId();

      const { status } = await requestServer()
        .get(`/api/project/${fakeId}`)
        .set('Cookie', `accessToken=${token}`);

      expect(status).to.be.eq(404);
    });

    it('Запрос проекта не от участника отдает 403', async () => {
      const { project } = await createProjectMock();
      const { token } = await createProjectMock();

      const { status } = await requestServer()
        .get(`/api/project/${project.id}`)
        .set('Cookie', `accessToken=${token}`);

      expect(status).to.be.eq(403);
    });

    it('Запрос от участника проекта отдает 200, ответ содержит поля id, users', async () => {
      const { project, token } = await createProjectMock();

      const { status, body } = await requestServer()
        .get(`/api/project/${project.id}`)
        .set('Cookie', `accessToken=${token}`);

      expect(status).to.be.eq(200);
      expect(body).to.have.property('id');
      expect(body).to.have.property('users');
    });
  });

  describe('POST /:id/invite', () => {
    it('Запрос без accessToken отдает 401', async () => {
      const { project } = await createProjectMock();

      const { status } = await requestServer()
        .post(`/api/project/${project.id}/invite`);

      expect(status).to.be.eq(401);
    });

    it('Запрос без поля userId отдает 400', async () => {
      const { token, project } = await createProjectMock();

      const { status } = await requestServer()
        .post(`/api/project/${project.id}/invite`)
        .set('Cookie', `accessToken=${token}`);

      expect(status).to.be.eq(400);
    });

    it('Запрос с невалидным id отдает 404', async () => {
      const { token } = await createProjectMock();
      const { me: user } = await createProjectMock();

      const fakeId = createFakeId();

      const { status } = await requestServer()
        .post(`/api/${fakeId}/invite`)
        .set('Cookie', `accessToken=${token}`)
        .send({ userId: user.id });

      expect(status).to.be.eq(404);
    });

    it('Запрос не от участника проета отдает 403', async () => {
      const { project } = await createProjectMock();
      const { token, me: user } = await createProjectMock();

      const { status } = await requestServer()
        .post(`/api/project/${project.id}/invite`)
        .set('Cookie', `accessToken=${token}`)
        .send({ userId: user.id });

      expect(status).to.be.eq(403);
    });

    it('Успешное добавление юзера в проект отдает 200, юзер есть в users', async () => {
      const { project, token } = await createProjectMock();
      const { me: user } = await createProjectMock();

      const { status, body } = await requestServer()
        .post(`/api/project/${project.id}/invite`)
        .set('Cookie', `accessToken=${token}`)
        .send({ userId: user.id });

      expect(status).to.be.eq(200);
      expect(body.users).to.deep.include({ id: user.id, name: user.name });
    });
  });
});
