import { CompanyService } from '@Services/CompanyService/CompanyService';

import { Controller } from '@Classes/Controller/Controller';

const companyController = new Controller('/company');

companyController.createEndpoint(
  'post',
  '/create',
  async (req, res) => {
    const { name } = Controller.getRequired(req, ['name']);
    const { me } = req;

    const company = await me.createCompany({ name });

    return Controller.sendResponse(res, company);
  },
);

companyController.createEndpoint(
  'post',
  '/:id/change-owner',
  async (req, res) => {
    const { userId } = Controller.getRequired(req, ['userId']);
    const { id } = Controller.getRequired(req, ['id'], 'params');
    const { me } = req;

    const company = await CompanyService.changeCompanyOwner({ companyId: id, userId, me });

    return Controller.sendResponse(res, company);
  },
);

companyController.createEndpoint(
  'get',
  '/:id',
  async (req, res) => {
    const { id } = Controller.getRequired(req, ['id'], 'params');
    const { me } = req;

    const company = await CompanyService.getCompany({ me, id });

    Controller.sendResponse(res, company);
  },
);

companyController.createEndpoint(
  'post',
  '/:id/create-project',
  async (req, res) => {
    const { id } = Controller.getRequired(req, ['id'], 'params');
    const { name } = Controller.getRequired(req, ['name']);
    const { me } = req;

    const company = await CompanyService.getCompany({ me, id });
    const project = await CompanyService.createProject({
      company,
      me,
      project: {
        name,
      },
    });

    Controller.sendResponse(res, project);
  },
);

export { companyController };
