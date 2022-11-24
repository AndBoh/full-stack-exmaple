import { NextFunction, Request, Response } from 'express';

import UserService from '@Services/UserService/User.service';

import { User } from '@Models';

import { UnauthorizedError } from '@Classes/Error/UnauthorizedError';

const checkAccessTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { cookies: { accessToken } } = req;

    req.me = await UserService.getUserByAccessToken({ accessToken }) as User;

    return next();
  } catch (e) {
    return next(new UnauthorizedError());
  }
};

export { checkAccessTokenMiddleware };
