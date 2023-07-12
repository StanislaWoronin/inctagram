import { ApiProperty } from '@nestjs/swagger';
import { User } from '@prisma/client';

type TViewUser = Pick<User, 'id' | 'userName' | 'email' | 'createdAt'>;

export class ViewUser implements TViewUser {
  @ApiProperty({ description: 'UUID' })
  id: string;

  @ApiProperty({ example: 'UserLogin' })
  userName: string;

  @ApiProperty({ example: 'somemail@mail.com' })
  email: string;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: string;

  static async create(user: User) {
    const viewUser = new ViewUser();
    viewUser.id = user.id;
    viewUser.userName = user.userName;
    viewUser.email = user.email;
    viewUser.createdAt = user.createdAt;
    return viewUser;
  }
}
