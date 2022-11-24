import {
  CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';

import { DBService } from '@Services/DBService/DB.service';

import { AccessToken, Company } from '@Models';

import { loginRegexp } from '@Constants/Regexp';

class User extends Model
  <
  InferAttributes<User>,
  InferCreationAttributes<User>
  > {
  declare id: CreationOptional<string>;
  declare name: string;
  declare password: string;
  declare login: string;
  declare companies?: Company[];

  public static associate(models: any) {
    this.hasMany(models.AccessToken, {
      foreignKey: 'userId',
      as: 'accessTokens',
    });

    this.hasMany(models.Company, {
      foreignKey: 'ownerId',
      as: 'companies',
    });

    this.belongsToMany(models.Project, {
      as: 'projects',
      through: 'Projects_Users',
    });
  }

  public async createAccessToken() {
    return AccessToken.create({
      userId: this.id,
    });
  }

  public async revokeAllAccessTokens() {
    return AccessToken.destroy({
      where: {
        userId: this.id,
      },
    });
  }

  public async createCompany({ name }:
  {
    name: string,
  }) {
    return Company.create({
      name,
      ownerId: this.id,
    });
  }
}

User.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  login: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [3, 20],
      is: loginRegexp,
    },
  },
}, {
  sequelize: DBService.getInstance().sequelize,
  modelName: 'User',
  tableName: 'Users',
  paranoid: true,
  defaultScope: {
    attributes: ['id', 'name'],
  },
  scopes: {
    me: {
      include: [
        {
          association: 'companies',
        },
        {
          association: 'projects',
          include: [
            {
              association: 'users',
              through: {
                attributes: [],
              },
            },
          ],
          through: {
            attributes: [],
          },
        },
      ],
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt', 'password'],
      },
    },
  },
});

export { User };
