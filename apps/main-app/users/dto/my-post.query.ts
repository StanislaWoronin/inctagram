import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { getSkipCount } from '../../../../libs/shared/helpers';

export class MyPostQuery {
  @ApiProperty({ default: 0, required: false })
  @IsOptional()
  @IsNumber()
  page = 1;

  static getSkipCount(page: number) {
    return getSkipCount(page);
  }
}
