import { Posts } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

type TCreatedPost = Pick<Posts, 'description'> & { postPhotos: string[] };

export class CreatedPostView implements TCreatedPost {
  @ApiProperty({ example: 'Some post description' })
  description: string;

  @ApiProperty({ example: ['fist-post-image-link', 'second-post-image-link'] })
  postPhotos: string[];
}
