import { ApiProperty } from '@nestjs/swagger';

export class TokenResponseView {
  @ApiProperty({
    type: String,
    description: 'Access token for users',
  })
  accessToken: string;
}
