import { ApiProperty } from '@nestjs/swagger';

export class DeletePostDto {
  @ApiProperty({ default: true })
  isDeleted = true;
}
