import { ViewUser } from '../../users/view-model/user.view-model';
import { TokenResponseView } from './token-response.view';
import {ApiProperty} from "@nestjs/swagger";

export type TLoginView = TokenResponseView & { user: ViewUser };

export class LoginView extends ViewUser {
    @ApiProperty({
        type: String,
        description: 'Access token for user',
    })
    accessToken: string;
}


