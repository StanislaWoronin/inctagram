import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';
import { Transform } from 'class-transformer';

export class RegistrationViaThirdPartyServicesDto {
  @ApiProperty({ description: 'Some code from client.' })
  @IsString()
  @Transform(({ value }) => value?.trim())
  @IsNotEmpty()
  code: string;
}
