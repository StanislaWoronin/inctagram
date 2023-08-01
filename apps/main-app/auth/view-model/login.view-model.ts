import { ViewUser } from '../../users/view-model/user.view-model';
import { TokenResponseView } from './token-response.view';
import { ApiProperty } from '@nestjs/swagger';

export type TLoginView = TokenResponseView & { user: ViewUser };

export class LoginView implements TLoginView {
  @ApiProperty({
    type: String,
    description: 'Access token for users',
  })
  accessToken: string;

  @ApiProperty({
    type: ViewUser,
  })
  user: ViewUser;
}
