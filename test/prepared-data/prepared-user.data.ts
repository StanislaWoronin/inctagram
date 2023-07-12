import { faker } from '@faker-js/faker';
import { userConstants } from '../../apps/main-app/users/user.constants';

const minLoginLength = userConstants.nameLength.min;
const maxLoginLength = userConstants.nameLength.max;
const maxFirstNameLength = userConstants.firstNameLength.max;
const maxLastNameLength = userConstants.lastNameLength.max;
const cityMaxLength = userConstants.cityLength.max;
const aboutMeMaxLength = userConstants.aboutMeLength.max;
const nonExistingDate = new Date();
nonExistingDate.setDate(nonExistingDate.getDate() + 1);

export const preparedUserData = {
  valid: {
    userName: 'Agent007',
    firstName: 'James',
    lastName: 'Bond',
    birthday: new Date().toLocaleDateString(),
    city: 'London',
    aboutMe: 'spy',
  },
  incorrect: {
    short: {
      userName: faker.string.alpha({
        length: { min: minLoginLength - 1, max: minLoginLength - 1 },
      }),
      firstName: '',
      lastName: '',
      birthday: '',
      city: '',
      aboutMe: '',
    },
    long: {
      userName: faker.string.alpha({
        length: { min: maxLoginLength + 1, max: maxLoginLength + 1 },
      }),
      firstName: faker.string.alpha({
        length: { min: maxFirstNameLength + 1, max: maxFirstNameLength + 1 },
      }),
      lastName: faker.string.alpha({
        length: { min: maxLastNameLength + 1, max: maxLastNameLength + 1 },
      }),
      birthday: new Date().toISOString(),
      city: faker.string.alpha({
        length: { min: cityMaxLength + 1, max: cityMaxLength + 1 },
      }),
      aboutMe: faker.string.alpha({
        length: { min: aboutMeMaxLength + 1, max: aboutMeMaxLength + 1 },
      }),
    },
    wrongBirthday: {
      userName: 'Agent007',
      firstName: 'James',
      lastName: 'Bond',
      birthday: new Date().toString(),
      city: 'London',
      aboutMe: 'spy',
    },
    nonExistingDate: {
      userName: 'Agent007',
      firstName: 'James',
      lastName: 'Bond',
      birthday: nonExistingDate.toLocaleDateString(),
      city: 'London',
      aboutMe: 'spy',
    },
  },
};
