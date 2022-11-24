import { AuthService } from '@Services/AuthService/Auth.service';

import { checkAccessTokenMiddleware } from '@Middlewares/CheckAccessTokenMiddleware';

import { Controller } from '@Classes/Controller/Controller';
import { BadRequestError, ValidationErrorItem } from '@Classes/Error';

import { passwordRegex } from '@Constants/Regexp';

const authController = new Controller('/auth');

authController.createEndpoint(
  'post',
  '/login',
  async (req, res) => {
    const { login, password } = Controller.getRequired(req, ['login', 'password']);

    const { user, accessToken: { token } } = await AuthService.loginUser({ login, password });

    res.cookie('accessToken', token, { httpOnly: true });
    return Controller.sendResponse(res, user);
  },
);

authController.createEndpoint(
  'post',
  '/register',
  async (req, res) => {
    const { name, password, login } = Controller.getRequired(req, ['name', 'password', 'login']);

    if (!password.match(passwordRegex)) {
      throw new BadRequestError(
        undefined,
        [
          new ValidationErrorItem(
            password,
            'password',
            'wrong format',
          ),
        ],
      );
    }

    await AuthService.registerUser({
      name,
      password,
      login,
    });

    const { user, accessToken: { token } } = await AuthService.loginUser({ login, password });

    res.cookie('accessToken', token, { httpOnly: true });
    return Controller.sendResponse(res, user);
  },
);

authController.createEndpoint(
  'post',
  '/logout',
  async (req, res) => {
    const { accessToken } = Controller.getRequired(req, ['accessToken'], 'cookies');
    const { me } = req;

    await AuthService.logoutUser({ me, accessToken });

    res.clearCookie('accessToken');
    return Controller.sendResponse(res, 'OK');
  },
  checkAccessTokenMiddleware,
);

authController.createEndpoint(
  'post',
  '/revoke',
  async (req, res) => {
    Controller.getRequired(req, ['accessToken'], 'cookies');
    const { me } = req;

    await AuthService.revokeUserAccessTokens({ me });

    res.clearCookie('accessToken');
    return Controller.sendResponse(res, 'OK');
  },
  checkAccessTokenMiddleware,
);

authController.createEndpoint(
  'get',
  '/',
  async (req, res) => {
    const { me } = req;
    return Controller.sendResponse(res, me);
  },
  checkAccessTokenMiddleware,
);

export { authController };
