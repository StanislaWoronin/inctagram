import { User } from '@prisma/client';
import { PhotoType } from '../../libs/shared/enums/photo-type.enum';

export type TFullUser = Omit<User, 'birthday'> & { birthday: Date | string };

export class FullUser implements TFullUser {
  id: string;
  userName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  firstName: string;
  lastName: string;
  birthday: Date;
  city: string;
  aboutMe;
  isConfirmed: boolean;
  Device: {
    deviceId: string;
    ipAddress: string;
    title: string;
    createdAt: string;
  }[];
  EmailConfirmation: {
    confirmationCode: string;
  };
  PasswordRecovery: {
    passwordRecoveryCode: string;
  };
  Avatar: {
    photoLink: string;
  };
}
