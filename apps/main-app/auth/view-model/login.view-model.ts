import { ViewUser } from '../../users/view-model/user.view-model';
import { TokenResponseView } from './token-response.view';
import { ApiProperty } from '@nestjs/swagger';
import { ViewUserWithInfo } from '../../users/view-model/user-with-info.view-model';

export type TLoginView = TokenResponseView & { user: ViewUserWithInfo };

export class LoginView implements TLoginView {
  @ApiProperty({
    type: String,
    description: 'Access token for users',
  })
  accessToken: string;

  @ApiProperty({
    type: ViewUserWithInfo,
  })
  user: ViewUserWithInfo;
}
