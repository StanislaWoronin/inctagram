import { faker } from '@faker-js/faker';
import { userConstants } from '../../apps/main-app/users/user.constants';

const validLogin = 'UserName';
const validEmail = 'somemail@gmail.com';
const validPassword = 'qwerty123';
const minLoginLength = userConstants.nameLength.min;
const maxLoginLength = userConstants.nameLength.max;
const minPasswordLength = userConstants.passwordLength.min;
const maxPasswordLength = userConstants.passwordLength.max;
const shortPassword = faker.string.alpha({
  length: { min: minPasswordLength - 1, max: minPasswordLength - 1 },
});
const longPassword = faker.string.alpha({
  length: { min: maxPasswordLength + 1, max: maxPasswordLength + 1 },
});

export const preparedRegistrationData = {
  valid: {
    userName: validLogin,
    email: validEmail,
    password: validPassword,
    passwordConfirmation: validPassword,
  },
  incorrect: {
    short: {
      userName: faker.string.alpha({
        length: { min: maxLoginLength + 1, max: maxLoginLength + 1 },
      }),
      email: 'somemailgmail.com',
      password: shortPassword,
      passwordConfirmation: shortPassword,
    },
    long: {
      userName: faker.string.alpha({
        length: { min: minLoginLength - 1, max: minLoginLength - 1 },
      }),
      email: 'somemailgmail.com',
      password: longPassword,
      passwordConfirmation: longPassword,
    },
    differentPassword: {
      userName: validLogin,
      email: validEmail,
      password: validPassword,
      passwordConfirmation: validPassword + 1,
    },
  },
};

export const preparedLoginData = {
  valid: {
    email: validEmail,
    password: validPassword,
  },
  incorrect: {
    email: validEmail + 1,
    password: validPassword + 1,
  },
};
