import { TUserData } from '../../../../libs/decorators/user-name.secorator';

export type UserIdWith<T> = { userId: string } & Partial<T>;

export type PostIdWith<T> = { postId: string } & Partial<T>;

export type UserDataWith<T> = TUserData & Partial<T>;
