import { faker } from '@Tests/index';

import { User } from '@Models';

import { CryptoService } from '@Services/CryptoService/Crypto.service';

export const createRandomString = (length = 10) => faker.random.alphaNumeric(length);

export const createLogin = () => faker.random.alphaNumeric(10);

export const createName = () => faker.name.fullName();

export const createPassword = (valid: boolean = true) => faker.random.alphaNumeric(valid ? 10 : 2);

export const createCompanyName = () => faker.company.name();

export const createProjectName = () => faker.random.words(2);

export const createFakeId = () => faker.datatype.uuid();

export const createUserMock = async () => {
  const login = createLogin();

  const name = createName();

  const password = createPassword();

  const user = await User.scope('me').create({
    login,
    password: CryptoService.makeHashWithSalt(password),
    name,
  });

  const { token } = await user.createAccessToken();

  return {
    token, user, login, name, password,
  };
};

export const createCompanyMock = async () => {
  const companyName = createCompanyName();

  const userData = await createUserMock();

  const company = await userData.user.createCompany({
    name: companyName,
  });

  await userData.user.reload();

  return {
    ...userData, company, companyName, me: userData.user,
  };
};

export const createProjectMock = async () => {
  const projectName = createProjectName();

  const companyData = await createCompanyMock();

  const { me, company } = companyData;

  const project = await company.createProject({
    name: projectName,
  });

  await project.joinUser(me);

  return { ...companyData, project, projectName };
};
