import {
  CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';

import { DBService } from '@Services/DBService/DB.service';

import { User } from '@Models';

class Project extends Model
  <
  InferAttributes<Project>,
  InferCreationAttributes<Project>
  > {
  declare id: CreationOptional<string>;
  declare name: string;
  declare companyId: string;
  declare users?: User[];
  declare addUser: CreationOptional<(user: User) => Promise<void>>;
  declare getUsers: CreationOptional<() => Promise<User[]>>;

  public static associate(models: any) {
    this.belongsToMany(models.User, {
      as: 'users',
      through: 'Projects_Users',
    });

    this.belongsTo(models.Company, {
      as: 'company',
    });
  }

  public async joinUser(user: User) {
    await this.addUser(user);
    return this.reload();
  }
}

Project.init({
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  companyId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  sequelize: DBService.getInstance().sequelize,
  modelName: 'Project',
  tableName: 'Projects',
  paranoid: true,
  defaultScope: {
    attributes: ['id', 'name'],
  },
  scopes: {
    participant: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
      include: [
        {
          association: 'users',
          through: {
            attributes: [],
          },
        },
      ],
    },
  },
});

export { Project };
