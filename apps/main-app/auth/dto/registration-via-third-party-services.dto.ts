import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';
import { PairTokenDto } from './pair-token.dto';
import { ViewUser } from '../../users/view-model/user.view-model';

export class RegistrationViaThirdPartyServicesDto {
  @ApiProperty({ description: 'Some code from client.' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  code: string;
}

export type TRegistrationViaThirdPartyServices = PairTokenDto & {
  user: ViewUser;
};

export type TLoginUserViaThirdPartyServices =
  TRegistrationViaThirdPartyServices & { isAuth: boolean };
