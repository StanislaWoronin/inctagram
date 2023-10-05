import bcrypt from 'bcrypt';
import { BadRequestException } from '@nestjs/common';
import { User } from '@prisma/client';
import { GitHubUserDto } from '../../auth/dto/git-hub-user.dto';

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

  static async create(user: Partial<NewUser>) {
    const newUser = new NewUser();
    Object.assign(newUser, user);
    if (!user.createdAt) {
      newUser.createdAt = new Date().toISOString();
    }
    newUser.passwordHash = await bcrypt.hash(user.password, 10);
    return newUser;
  }

  static createViaThirdPartyServices({ name, email }) {
    const newUser = new NewUser();
    newUser.userName = name;
    newUser.email = email;
    newUser.createdAt = new Date().toISOString();
    newUser.isConfirmed = true;
    return newUser;
  }
}
