import { UpdateUserProfileDto } from '../../apps/main-app/users/dto/update-user.dto';

export type TUpdateUserProfileTestDto = Omit<
  UpdateUserProfileDto,
  'birthday'
> & { birthday: string };
