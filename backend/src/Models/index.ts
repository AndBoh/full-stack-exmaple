import { User } from '@Models/User';
import { AccessToken } from '@Models/AccessToken';
import { Company } from '@Models/Company';
import { Project } from '@Models/Project';

const models = {
  User,
  AccessToken,
  Company,
  Project,
};

Object.values(models).forEach((model) => {
  if ('associate' in model) {
    model.associate(models);
  }
});

export {
  User,
  AccessToken,
  Company,
  Project,
};
