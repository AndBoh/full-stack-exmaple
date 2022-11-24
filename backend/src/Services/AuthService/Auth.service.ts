import { StatusCodes } from 'http-status-codes';
import { ValidationError as SequelizeValidationError } from 'sequelize';

import { ApplicationError, ValidationError, ErrorCode } from '@Classes/Error';
import { ConflictError } from '@Classes/Error/ConflictError';

import { LoggerService } from '@Services/LoggerService/Logger.service';
import { CryptoService } from '@Services/CryptoService/Crypto.service';
import { AbstractLogger } from '@Services/LoggerService/AbstractLogger';

import { AccessToken, User } from '@Models';

const logger: AbstractLogger = LoggerService.getLogger('AuthService');

class AuthService {
  public static async registerUser(user:
  {
    login: string,
    password: string,
    name: string,
  }) {
    const { login, password } = user;

    let createdUser;
    let created;

    try {
      [createdUser, created] = await User.findOrCreate({
        where: {
          login,
        },
        defaults: {
          ...user,
          login: login.toLowerCase(),
          password: CryptoService.makeHashWithSalt(password),
        },
      });
    } catch (e) {
      if (e instanceof SequelizeValidationError) {
        throw new ValidationError(e);
      }

      throw e;
    }

    if (!created) {
      throw new ConflictError('User with this login already exist');
    }

    return createdUser;
  }

  public static async loginUser({ login, password }:
  {
    login: string,
    password: string,
  }) {
    const user = await User
      .scope('me')
      .findOne({
        where: {
          login: login.toLowerCase(),
          password: CryptoService.makeHashWithSalt(password),
        },
      });

    // TODO: Разделить кейсы юзер не найден/не правильный пароль.
    //  Применить NotFoundError. Поправить тесты.
    if (!user) {
      logger.info(new ApplicationError(
        `Attempt to login as user "${login}" with wrong password "${password}"`,
        ErrorCode.NOT_FOUND,
        StatusCodes.NOT_FOUND,
        'User not found',
      ));
    }

    const accessToken = await user.createAccessToken();

    logger.debug(`User ${user.login} successfully logged in`);

    return {
      user,
      accessToken,
    };
  }

  public static async logoutUser({ me, accessToken }:
  {
    me: User,
    accessToken: string,
  }) {
    const result = !!(await AccessToken.destroy({
      where: {
        userId: me.id,
        token: accessToken,
      },
    }));

    logger.debug(`User "${me.login}" with token "${accessToken}" successfully logged out`);

    return result;
  }

  public static async revokeUserAccessTokens({ me }:
  {
    me: User
  }) {
    await me.revokeAllAccessTokens();

    logger.info(`Access tokens of user "${me.login}" has been successfully revoked`);
  }
}

export { AuthService };
