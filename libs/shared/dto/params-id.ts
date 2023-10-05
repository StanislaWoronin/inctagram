import { isUUID } from 'class-validator';
import { Transform } from 'class-transformer';
import { BadRequestException } from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';

export class ParamsId {
  @ApiProperty({})
  @Transform(({ value }) => {
    try {
      if (isUUID(value)) {
        return value;
      }
      throw new BadRequestException('');
    } catch (e) {
      throw new BadRequestException();
    }
  })
  id: string;
}
