import bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';

export type TUser = User & { password: string; passwordConfirmation: string };

export class NewUser implements TUser {
  id: string;
  userName: string;
  email: string;
  passwordHash: string;
  createdAt: string;
  firstName: string | null;
  lastName: string | null;
  birthday: Date | null;
  city: string | null;
  aboutMe: string | null;
  isConfirmed: boolean;
  readonly password: string;
  readonly passwordConfirmation: string;

  static async create(_user: Partial<NewUser>) {
    const user = new NewUser();
    Object.assign(user, _user);
    if (!_user.createdAt) {
      user.createdAt = new Date().toISOString();
    }
    user.passwordHash = await bcrypt.hash(_user.password, 10);
    return user;
  }
}
