import { LoggerService } from '@Services/LoggerService/Logger.service';
import { AbstractLogger } from '@Services/LoggerService/AbstractLogger';

import { Company, Project, User } from '@Models';

import { NotFoundError, ForbiddenError } from '@Classes/Error';

const logger: AbstractLogger = LoggerService.getLogger('CompanyService');

class CompanyService {
  public static async createCompany({ user, company }:
  {
    user: User,
    company: {
      name: string,
    }
  }) {
    const createdCompany = await user.createCompany(company);

    logger.debug(`User ${user.id} successfully created company ${JSON.stringify(createdCompany.dataValues)}`);

    return createdCompany;
  }

  public static async changeCompanyOwner({ companyId, userId, me }: {
    companyId: string,
    userId: string,
    me: User,
  }) {
    const company = await Company.scope('owner').findOne({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      logger.debug(new NotFoundError('Company not found'));
    }

    if (company!.ownerId !== me.id) {
      logger.info(new ForbiddenError(
        'You can not change owner of this company',
        `User "${me.id}" tries to change company "${company?.id}" owner. Forbidden`,
      ));
    }

    const newOwner = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!newOwner) {
      logger.debug(new NotFoundError('User not found'));
    }

    await company.changeOwner(newOwner!.id);

    logger.debug(`Owner of company "${company.id}" successfully changed to "${newOwner.id}"`);
    return {
      companyId: company.id,
      ownerId: newOwner.id,
    };
  }

  public static async getCompany({ me, id }:
  {
    id: string,
    me: User,
  }) {
    const isCompanyOwner = me.companies?.some((company) => company.id === id);

    const modelScope = isCompanyOwner ? 'owner' : 'defaultScope';

    const company = await Company.scope(modelScope).findOne({
      where: {
        id,
      },
    });

    if (!company) {
      throw new NotFoundError('Company not found');
    }

    return company;
  }

  public static async createProject({
    company,
    me,
    project,
  }:
  {
    company: Company,
    me: User,
    project: {
      name: string,
    },
  }) {
    if (company.ownerId !== me.id) {
      throw new ForbiddenError('You can not create a project in this company');
    }

    const createdProject = await company.createProject(project);

    await CompanyService.joinUserToProject({
      userId: me.id,
      project: createdProject,
    });

    return createdProject;
  }

  public static async joinUserToProject({
    userId,
    project,
  }: {
    userId: string,
    project: Project,
  }) {
    const user = await User.findOne({
      where: {
        id: userId,
      },
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    await project.joinUser(user);
    return project.reload();
  }

  public static async getProject({
    id,
    me,
  }:
  {
    id: string,
    me: User,
  }) {
    const project = await Project.scope('participant').findOne({
      where: {
        id,
      },
    });

    if (!project) {
      throw new NotFoundError('Project not found');
    }

    if (project.users?.every((projectUser) => projectUser.id !== me.id)) {
      throw new ForbiddenError('You are not participant of this project');
    }

    return project;
  }
}

export { CompanyService };
