import { LoggerService } from '@Services/LoggerService/Logger.service';

import { User } from '@Models';

import { ApplicationError, NotFoundError } from '@Classes/Error';

const logger = LoggerService.getLogger('UserService');

class UserService {
  public static async getUser({ me, id }:
  {
    me: User,
    id: string,
  }) {
    const scope = me.id === id ? 'me' : 'defaultScope';

    const user = await User
      .scope(scope)
      .findOne({
        where: {
          id,
        },
      });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  public static async getUserByAccessToken({ accessToken }:
  {
    accessToken: string,
  }) {
    const user = await User.scope('me').findOne({
      include: [
        {
          association: 'accessTokens',
          where: {
            token: accessToken,
          },
          attributes: [],
        },
      ],
    });

    if (!user) {
      logger.info(new ApplicationError(`User not found by access token "${accessToken}"`));
    }

    return user;
  }
}

export default UserService;
