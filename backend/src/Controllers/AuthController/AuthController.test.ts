import {
  clearDatabase, requestServer, expect,
} from '@Tests';

import {
  createFakeId,
  createLogin, createName, createPassword, createUserMock,
} from '@Tests/Mock';

describe('/auth', () => {
  beforeEach(clearDatabase);

  describe('POST /register', () => {
    it('Запрос без поля login отдает 400', async () => {
      const { status, body } = await requestServer()
        .post('/auth/register')
        .send({
          name: createName(),
          password: createPassword(),
        });

      expect(status).to.be.eq(400);
      expect(body.errors).to.deep.include({ token: 'login', type: 'required' });
    });

    it('Запрос без поля name отдает 400', async () => {
      const { status, body } = await requestServer()
        .post('/auth/register')
        .send({
          login: createLogin(),
          password: createPassword(),
        });

      expect(status).to.be.eq(400);
      expect(body.errors).to.deep.include({ token: 'name', type: 'required' });
    });

    it('Запрос без поля password отдает 400', async () => {
      const { status, body } = await requestServer()
        .post('/auth/register')
        .send({
          login: createLogin(),
          name: createName(),
        });

      expect(status).to.be.eq(400);
      expect(body.errors).to.deep.include({ token: 'password', type: 'required' });
    });

    it('Запрос с невалидным password отдает 400', async () => {
      const password = createPassword(false);

      const { status, body } = await requestServer()
        .post('/auth/register')
        .send({
          password,
          login: createLogin(),
          name: createName(),
        });

      expect(status).to.be.eq(400);
      expect(body.errors).to.deep.include({ value: password, token: 'password', type: 'wrong format' });
    });

    it('Успешная регистрация отдает 200', async () => {
      const login = createLogin();
      const name = createName();
      const password = createPassword();

      const { status, body, header } = await requestServer()
        .post('/auth/register')
        .send({
          login,
          name,
          password,
        });

      expect(status).to.be.eq(200);
      expect(body).to.have.property('id');
      expect(body).to.not.have.property('password');
      expect(body.name).to.be.eq(name);
      expect(body.login).to.be.eq(login);
      expect(header['set-cookie'][0]).to.include('accessToken=');
    });

    it('Регистрация с существующим login отдает 409', async () => {
      const { login } = await createUserMock();

      const { status } = await requestServer()
        .post('/auth/register')
        .send({
          login,
          password: createPassword(),
          name: createName(),
        });

      expect(status).to.be.eq(409);
    });
  });

  describe('POST /login', () => {
    it('Запрос без password отдает 400', async () => {
      const { status, body } = await requestServer()
        .post('/auth/login')
        .send({
          login: createLogin(),
        });

      expect(status).to.be.eq(400);
      expect(body.errors).to.deep.include({ token: 'password', type: 'required' });
    });

    it('Запрос без login отдает 400', async () => {
      const { status, body } = await requestServer()
        .post('/auth/login')
        .send({
          password: createPassword(),
        });

      expect(status).to.be.eq(400);
      expect(body.errors).to.deep.include({ token: 'login', type: 'required' });
    });

    it('Запрос с не верным password отдает 404', async () => {
      const { login } = await createUserMock();

      const { status } = await requestServer()
        .post('/auth/login')
        .send({
          login,
          password: createPassword(),
        });

      expect(status).to.be.eq(404);
    });

    it('Успешный вход отдает 200', async () => {
      const { login, password, name } = await createUserMock();

      const { status, body, header } = await requestServer()
        .post('/auth/login')
        .send({
          login,
          password,
        });

      expect(status).to.be.eq(200);
      expect(body).to.have.property('id');
      expect(body).to.not.have.property('password');
      expect(body.name).to.be.eq(name);
      expect(body.login).to.be.eq(login);
      expect(header['set-cookie'][0]).to.include('accessToken=');
    });
  });

  describe('POST /logout', () => {
    it('Запрос без accessToken отдает 401', async () => {
      const { status } = await requestServer()
        .post('/auth/logout');

      expect(status).to.be.eq(401);
    });

    it('Запрос с валидным accessToken отдает 200', async () => {
      const { token } = await createUserMock();

      const { status, header } = await requestServer()
        .post('/auth/logout')
        .set('Cookie', `accessToken=${token}`);

      expect(status).to.be.eq(200);
      expect(header['set-cookie'][0]).to.include('accessToken=;');
    });

    it('Запрос с несуществующим accessToken отдает 401', async () => {
      const { status } = await requestServer()
        .post('/auth/logout')
        .set('Cookie', `accessToken=${createFakeId()}`);

      expect(status).to.be.eq(401);
    });
  });

  describe('POST /revoke', () => {
    it('Запрос без accessToken отдает 401', async () => {
      const { status } = await requestServer()
        .post('/auth/revoke');

      expect(status).to.be.eq(401);
    });

    it('Запрос с невалидным accessToken отдает 401', async () => {
      const { status } = await requestServer()
        .post('/auth/revoke')
        .set('Cookie', `accessToken=${createFakeId()}`);

      expect(status).to.be.eq(401);
    });

    it('Запрос с валидным accessToken отдает 200', async () => {
      const { token } = await createUserMock();

      const { status, header } = await requestServer()
        .post('/auth/revoke')
        .set('Cookie', `accessToken=${token}`);

      expect(status).to.be.eq(200);
      expect(header['set-cookie'][0]).to.include('accessToken=;');
    });
  });
});
