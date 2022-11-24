import { CompanyService } from '@Services/CompanyService/CompanyService';

import { Controller } from '@Classes/Controller/Controller';

const projectController = new Controller('/project');

projectController.createEndpoint(
  'get',
  '/:id',
  async (req, res) => {
    const { id } = Controller.getRequired(req, ['id'], 'params');
    const { me } = req;

    const project = await CompanyService.getProject({ id, me });

    Controller.sendResponse(res, project);
  },
);

projectController.createEndpoint(
  'post',
  '/:id/invite',
  async (req, res) => {
    const { id } = Controller.getRequired(req, ['id'], 'params');
    const { userId } = Controller.getRequired(req, ['userId']);
    const { me } = req;

    const project = await CompanyService.getProject({ id, me });
    const joinedUser = await CompanyService.joinUserToProject({ userId, project });

    Controller.sendResponse(res, joinedUser);
  },
);

export { projectController };
