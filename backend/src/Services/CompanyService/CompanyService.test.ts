import { clearDatabase, expect } from '@Tests';

import {
  createCompanyMock,
  createCompanyName,
  createFakeId,
  createProjectMock,
  createProjectName,
  createUserMock,
} from '@Tests/Mock';

import { CompanyService } from '@Services/CompanyService/CompanyService';

import { Company, Project } from '@Models';

import { NotFoundError, ForbiddenError } from '@Classes/Error';

describe('CompanyService', () => {
  beforeEach(clearDatabase);

  describe('createCompany', () => {
    it('Успешное создание компании возвращает инстанс Company', async () => {
      const { user } = await createUserMock();

      const company = await CompanyService.createCompany({
        user,
        company: {
          name: createCompanyName(),
        },
      });

      expect(company).to.be.instanceof(Company);
    });
  });

  describe('changeCompanyOwner', () => {
    it('Вызов с несуществующим companyId выбрасывает ошибку NotFoundError', (done) => {
      createUserMock()
        .then(({ user: me }) => {
          createUserMock()
            .then(({ user }) => {
              CompanyService.changeCompanyOwner({
                userId: user.id,
                me,
                companyId: createFakeId(),
              })
                .then(done)
                .catch((error) => {
                  expect(error).to.be.instanceof(NotFoundError);
                  done();
                });
            })
            .catch(done);
        })
        .catch(done);
    });

    it('Вызов с несуществующим userId выбрасывает ошибку NotFoundError', (done) => {
      createCompanyMock()
        .then(({ me, company }) => {
          CompanyService.changeCompanyOwner({
            userId: createFakeId(),
            me,
            companyId: company.id,
          })
            .then(done)
            .catch((error) => {
              expect(error).to.be.instanceof(NotFoundError);
              done();
            });
        })
        .catch(done);
    });

    it('Успешная смена компании возвращает валидный результат с полями companyId и ownerId', async () => {
      const { me, company } = await createCompanyMock();
      const { user } = await createUserMock();

      const newInfo = await CompanyService.changeCompanyOwner({
        userId: user.id,
        me,
        companyId: company.id,
      });

      expect(newInfo).to.have.property('companyId');
      expect(newInfo).to.have.property('ownerId');
      expect(newInfo.companyId).to.be.eq(company.id);
      expect(newInfo.ownerId).to.be.eq(user.id);
    });

    it('Вызов для чужой компании выбрасывает ошибку ForbiddenError и логирует id юзера отправившего запрос', (done) => {
      createCompanyMock()
        .then(({ company, me }) => {
          createUserMock()
            .then(({ user }) => {
              CompanyService.changeCompanyOwner({
                userId: me.id,
                me: user,
                companyId: company.id,
              })
                .then(done)
                .catch((error) => {
                  expect(error).to.be.instanceof(ForbiddenError);
                  expect(error.loggerMessage).to.include(user.id);
                  done();
                });
            })
            .catch(done);
        })
        .catch(done);
    });
  });

  describe('getCompany', () => {
    it('Вызов с несуществующим id выбрасывает ошибку NotFoundError', (done) => {
      createCompanyMock()
        .then(({ me }) => {
          CompanyService.getCompany({
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

    it('Вызов для своей компании возвращает инстанс Company со связями projects, ...', async () => {
      const { me, company } = await createCompanyMock();

      const foundCompany = await CompanyService.getCompany({
        me,
        id: company.id,
      });

      expect(foundCompany).to.be.instanceof(Company);
      expect(foundCompany).to.have.property('projects');
    });

    it('Вызов для чужой компании возвращает инстанс Company без связей связями projects, ...', async () => {
      const { company } = await createCompanyMock();
      const { user: me } = await createUserMock();

      const foundCompany = await CompanyService.getCompany({
        me,
        id: company.id,
      });

      expect(foundCompany).to.be.instanceof(Company);
      expect(foundCompany).to.not.have.property('projects');
    });
  });

  describe('createProject', () => {
    it('Вызов для чужой компании выбрасывает ForbiddenError', (done) => {
      createCompanyMock()
        .then(({ company }) => {
          createUserMock()
            .then(({ user: me }) => {
              CompanyService.createProject({
                company,
                me,
                project: {
                  name: createProjectName(),
                },
              })
                .then(done)
                .catch((error) => {
                  expect(error).to.be.instanceof(ForbiddenError);
                  done();
                });
            })
            .catch(done);
        })
        .catch(done);
    });

    it('Успешный вызов возвращает инстанс Project, юзер добавлен', async () => {
      const { company, me } = await createCompanyMock();

      const project = await CompanyService.createProject({
        company,
        me,
        project: {
          name: createProjectName(),
        },
      });

      expect(project).to.be.instanceof(Project);
      expect(project).have.property('users');
      expect(project.users).to.be.lengthOf(1);
      expect(project.users?.[0].id).to.be.eq(me.id);
    });
  });

  describe('joinUserToProject', () => {
    it('Вызов с несуществующим userId выбрасывает NotFoundError', (done) => {
      createProjectMock()
        .then(({ project }) => {
          CompanyService.joinUserToProject({
            userId: createFakeId(),
            project,
          })
            .then(done)
            .catch((error) => {
              expect(error).to.be.instanceof(NotFoundError);
              done();
            });
        })
        .catch(done);
    });

    it('При попытке добавить себя возвращает инстанс Project, кол-во юзеров не изменилось', async () => {
      const { project, me } = await createProjectMock();

      const resultProject = await CompanyService.joinUserToProject({
        userId: me.id,
        project,
      });

      expect(resultProject).to.be.instanceof(Project);
      expect(resultProject).have.property('users');
      expect(resultProject.users).to.be.lengthOf(1);
    });

    it('Успешный вызов возвращает инстанс Project, юзер добавлен', async () => {
      const { project } = await createProjectMock();
      const { user } = await createUserMock();

      const resultProject = await CompanyService.joinUserToProject({
        userId: user.id,
        project,
      });

      expect(resultProject).to.be.instanceof(Project);
      expect(resultProject).have.property('users');
      expect(resultProject.users).to.be.lengthOf(2);
    });
  });

  describe('getProject', () => {
    it('Вызов с несуществующим id выбрасывает ошибку NotFoundError', (done) => {
      createProjectMock()
        .then(({ me }) => {
          CompanyService.getProject({
            id: createFakeId(),
            me,
          })
            .then(done)
            .catch((error) => {
              expect(error).to.be.instanceof(NotFoundError);
              done();
            });
        })
        .catch(done);
    });

    it('Вызов для чужого проекта выбрасывает ошибку ForbiddenError', (done) => {
      createProjectMock()
        .then(({ project }) => {
          createUserMock()
            .then(({ user: me }) => {
              CompanyService.getProject({
                id: project.id,
                me,
              })
                .then(done)
                .catch((error) => {
                  expect(error).to.be.instanceof(ForbiddenError);
                  done();
                });
            })
            .catch(done);
        })
        .catch(done);
    });

    it('Успешный вызов возвращает инстанс Project со связями users...', async () => {
      const { project, me } = await createProjectMock();

      const resultProject = await CompanyService.getProject({
        me,
        id: project.id,
      });

      expect(resultProject).to.be.instanceof(Project);
      expect(resultProject).to.have.property('users');
    });
  });
});
