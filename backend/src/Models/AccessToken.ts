import {
  CreationOptional, DataTypes, InferAttributes, InferCreationAttributes, Model,
} from 'sequelize';

import { DBService } from '@Services/DBService/DB.service';

class AccessToken extends Model
  <
  InferAttributes<AccessToken>,
  InferCreationAttributes<AccessToken>
  > {
  declare token: CreationOptional<string>;
  declare userId: string;

  public static associate(models: any) {
    this.belongsTo(models.User, {
      as: 'user',
    });
  }
}

AccessToken.init({
  token: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    unique: true,
    allowNull: false,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
}, {
  sequelize: DBService.getInstance().sequelize,
  modelName: 'AccessToken',
  tableName: 'AccessTokens',
  paranoid: false,
});

export { AccessToken };
