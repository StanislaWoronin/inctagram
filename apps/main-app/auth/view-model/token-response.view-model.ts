import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseViewModel {
  @ApiProperty({
    type: String,
    description: 'Access token for user',
  })
  accessToken: string;
}
