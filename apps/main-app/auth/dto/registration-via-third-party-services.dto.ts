import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PairTokenDto } from './pair-token.dto';
import { ViewUser } from '../../users/view-model/user.view-model';
import { ViewUserWithInfo } from '../../users/view-model/user-with-info.view-model';

export class RegistrationViaThirdPartyServicesDto {
  @ApiProperty({ description: 'Some code from client.' })
  @IsString()
  @IsNotEmpty()
  code: string;
}

export type TRegistrationViaThirdPartyServices = PairTokenDto & {
  user: ViewUserWithInfo;
};

export type TLoginUserViaThirdPartyServices =
  TRegistrationViaThirdPartyServices & { isAuth: boolean };
