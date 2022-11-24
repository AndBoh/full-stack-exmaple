import { checkAccessTokenMiddleware } from '@Middlewares/CheckAccessTokenMiddleware';

import { companyController } from '@Controllers/CompanyController/CompanyController';
import { projectController } from '@Controllers/ProjectController/ProjectController';

import { Controller } from '@Classes/Controller/Controller';

const apiController = new Controller('/api');

apiController.router.use(checkAccessTokenMiddleware);

apiController.use(companyController);
apiController.use(projectController);

export { apiController };
