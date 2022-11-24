import {
  clearDatabase, expect, requestServer,
} from '@Tests';

import { createCompanyMock, createCompanyName, createFakeId } from '@Tests/Mock';

describe('/company', () => {
  beforeEach(clearDatabase);

  describe('POST /create', () => {
    it('Запрос без accessToken отдает 401', async () => {
      const { status } = await requestServer()
        .post('/api/company/')
        .send({ name: createCompanyName() });

      expect(status).to.be.eq(401);
    });

    it('Запрос без поля name отдает 400', async () => {
      const { token } = await createCompanyMock();

      const { status, body } = await requestServer()
        .post('/api/company/create')
        .set('Cookie', `accessToken=${token}`);

      expect(status).to.be.eq(400);
      expect(body.errors).to.deep.include({ token: 'name', type: 'required' });
    });

    it('Успешное создание компании', async () => {
      const { token } = await createCompanyMock();

      const { status, body } = await requestServer()
        .post('/api/company/create')
        .set('Cookie', `accessToken=${token}`)
        .send({ name: createCompanyName() });

      expect(status).to.be.eq(200);
      expect(body).not.to.have.property('errors');
      expect(body).to.have.property('id');
    });
  });

  describe('POST /:id/change-owner', () => {
    it('Запрос без accessToken отдает 401', async () => {
      const { company } = await createCompanyMock();

      const { status } = await requestServer()
        .post(`/api/company/${company.id}/change-owner`)
        .send({ name: createCompanyName() });

      expect(status).to.be.eq(401);
    });

    it('Запрос с невалидным id отдает 404', async () => {
      const { token } = await createCompanyMock();
      const { me: user } = await createCompanyMock();

      const fakeId = createFakeId();

      const { status } = await requestServer()
        .post(`/api/company/${fakeId}/change-owner`)
        .set('Cookie', `accessToken=${token}`)
        .send({ userId: user.id });

      expect(status).to.be.eq(404);
    });

    it('Запрос с id чужой компании отдает 403', async () => {
      const { token, me } = await createCompanyMock();
      const { company } = await createCompanyMock();

      const { status } = await requestServer()
        .post(`/api/company/${company.id}/change-owner`)
        .set('Cookie', `accessToken=${token}`)
        .send({ userId: me.id });

      expect(status).to.be.eq(403);
    });

    it('Запрос без userId отдает 400', async () => {
      const { company, token } = await createCompanyMock();

      const { status, body } = await requestServer()
        .post(`/api/company/${company.id}/change-owner`)
        .set('Cookie', `accessToken=${token}`);

      expect(status).to.be.eq(400);
      expect(body.errors).to.deep.include({ token: 'userId', type: 'required' });
    });

    it('Запрос с несуществующим userId отдает 404', async () => {
      const { company, token } = await createCompanyMock();

      const fakeUserId = createFakeId();

      const { status } = await requestServer()
        .post(`/api/company/${company.id}/change-owner`)
        .set('Cookie', `accessToken=${token}`)
        .send({ userId: fakeUserId });

      expect(status).to.be.eq(404);
    });

    it('Успешная смена владельца компании', async () => {
      const { company, token } = await createCompanyMock();
      const { me: user } = await createCompanyMock();

      const { status, body } = await requestServer()
        .post(`/api/company/${company.id}/change-owner`)
        .set('Cookie', `accessToken=${token}`)
        .send({ userId: user.id });

      expect(status).to.be.eq(200);
      expect(body).to.have.property('companyId');
      expect(body).to.have.property('ownerId');
      expect(body.ownerId).to.be.eq(user.id);
    });
  });

  describe('GET /:id', () => {
    it('Запрос без accessToken отдает 401', async () => {
      const { company } = await createCompanyMock();

      const { status } = await requestServer()
        .get(`/api/company/${company.id}`);

      expect(status).to.be.eq(401);
    });

    it('Запрос с невалидным id отдает 404', async () => {
      const { token } = await createCompanyMock();

      const fakeId = createFakeId();

      const { status } = await requestServer()
        .get(`/api/company/${fakeId}`)
        .set('Cookie', `accessToken=${token}`);

      expect(status).to.be.eq(404);
    });

    it('Запрос от владельца компании отдает 200, ответ содержит поля ownerId и projects', async () => {
      const { company, token } = await createCompanyMock();

      const { status, body } = await requestServer()
        .get(`/api/company/${company.id}`)
        .set('Cookie', `accessToken=${token}`);

      expect(status).to.be.eq(200);
      expect(body).to.have.property('id');
      expect(body).to.have.property('name');
      expect(body).to.have.property('ownerId');
      expect(body).to.have.property('projects');
    });

    it('Запрос не от владельца компании отдает 200, ответ не содержит поля ownerId и projects', async () => {
      const { token } = await createCompanyMock();
      const { company } = await createCompanyMock();

      const { status, body } = await requestServer()
        .get(`/api/company/${company.id}`)
        .set('Cookie', `accessToken=${token}`);

      expect(status).to.be.eq(200);
      expect(body).to.have.property('id');
      expect(body).to.have.property('name');
      expect(body).to.not.have.property('ownerId');
      expect(body).to.not.have.property('projects');
    });
  });

  describe('POST /:id/create-project', () => {
    it('Запрос без accessToken отдает 401', async () => {
      const { company } = await createCompanyMock();

      const { status } = await requestServer()
        .post(`/api/company/${company.id}/create-project`)
        .send({
          name: createCompanyName(),
        });

      expect(status).to.be.eq(401);
    });

    it('Запрос с невалидным id отдает 404', async () => {
      const { token } = await createCompanyMock();

      const fakeId = createFakeId();

      const { status } = await requestServer()
        .post(`/api/company/${fakeId}/create-project`)
        .set('Cookie', `accessToken=${token}`)
        .send({
          name: createCompanyName(),
        });

      expect(status).to.be.eq(404);
    });

    it('Запрос без поля name отдает 400', async () => {
      const { company, token } = await createCompanyMock();

      const { status, body } = await requestServer()
        .post(`/api/company/${company.id}/create-project`)
        .set('Cookie', `accessToken=${token}`);

      expect(status).to.be.eq(400);
      expect(body.errors).to.deep.include({ token: 'name', type: 'required' });
    });

    it('Успешное создание проекта отдает 200, в проекте есть текущий юзер', async () => {
      const { company, token, me } = await createCompanyMock();

      const { status, body } = await requestServer()
        .post(`/api/company/${company.id}/create-project`)
        .set('Cookie', `accessToken=${token}`)
        .send({
          name: createCompanyName(),
        });

      expect(status).to.be.eq(200);
      expect(body.users).to.deep.include({ id: me.id, name: me.name });
    });
  });
});
