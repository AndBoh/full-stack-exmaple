import { StatusCodes, ReasonPhrases } from 'http-status-codes';
import {
  NextFunction, Request, Response, Router,
} from 'express';

import { BadRequestError, ValidationErrorItem } from '@Classes/Error';

export class Controller {
  public router: Router;

  constructor(public route: string) {
    this.router = Router();
  }

  createEndpoint(
    method: 'get' | 'post',
    route: string,
    action: (req: Request, res: Response, next: NextFunction) => Promise<any>,
    ...middlewares: ((...args: any[]) => any)[]
  ) {
    return this.router[method](route, ...middlewares, async (req, res, next) => {
      try {
        await action(req, res, next);
      } catch (e) {
        next(e);
      }
    });
  }

  use(controller: Controller): Router;
  use(router: Router): Router;
  use(controllerOrRouter: Controller | Router) {
    if (controllerOrRouter instanceof Controller) {
      return this.router.use(controllerOrRouter.route, controllerOrRouter.router);
    }

    return this.router.use(controllerOrRouter);
  }

  static getRequired<T extends string>(
    req: Request,
    fields: T[],
    part: 'body' | 'headers' | 'cookies' | 'params' = 'body',
  ): Record<string, any> {
    const result: Record<T, any> = Object.create({});
    const errors: ValidationErrorItem[] = [];

    fields.forEach((field) => {
      const value = req[part][field];

      if (!value) {
        errors.push(new ValidationErrorItem(
          value,
          field,
          'required',
        ));
      } else {
        result[field] = value;
      }
    });

    if (errors.length > 0) {
      throw new BadRequestError(ReasonPhrases.BAD_REQUEST, errors);
    }

    return result;
  }

  static sendResponse(res: Response, value: any, status: number = StatusCodes.OK) {
    return res.status(status).json(value);
  }
}
