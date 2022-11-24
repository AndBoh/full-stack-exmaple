import { authController } from '@Controllers/AuthController/AuthController';
import { apiController } from '@Controllers/ApiController/ApiController';

import { handleErrorMiddleware } from '@Middlewares/HandleErrorMiddleware';

import { Controller } from '@Classes/Controller/Controller';

const rootController = new Controller('/');

rootController.use(apiController);
rootController.use(authController);

rootController.router.use(handleErrorMiddleware);

export { rootController };
