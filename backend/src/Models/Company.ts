import {
  CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';

import { DBService } from '@Services/DBService/DB.service';

import { Project } from '@Models';

class Company extends Model
  <
  InferAttributes<Company>,
  InferCreationAttributes<Company>
  > {
  declare id: CreationOptional<string>;
  declare name: string;
  declare ownerId: string;

  public static associate(models: any) {
    this.belongsTo(models.User, {
      as: 'owner',
    });

    this.hasMany(models.Project, {
      as: 'projects',
      foreignKey: 'companyId',
    });
  }

  public async changeOwner(ownerId: string) {
    return this.update({
      ownerId,
    });
  }

  public async createProject(project:
  {
    name: string,
  }) {
    return Project.scope('participant').create({
      ...project,
      companyId: this.id,
    });
  }
}

Company.init({
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
  ownerId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  sequelize: DBService.getInstance().sequelize,
  modelName: 'Company',
  tableName: 'Companies',
  paranoid: true,
  defaultScope: {
    attributes: ['id', 'name'],
  },
  scopes: {
    owner: {
      attributes: {
        exclude: ['createdAt', 'updatedAt', 'deletedAt'],
      },
      include: [
        {
          association: 'projects',
        },
      ],
    },
  },
});

export { Company };
