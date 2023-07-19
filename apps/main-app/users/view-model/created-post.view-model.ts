import { Posts } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

type TCreatedPost = Omit<Posts, 'Photos' | 'isDeleted'> & {
  postPhotos: string[];
};

export class CreatedPostView implements TCreatedPost {
  @ApiProperty({ example: 'Post ID.' })
  id: string;

  @ApiProperty({ example: 'Post owner ID.' })
  userId: string;

  @ApiProperty({ example: 'Some post description.' })
  description: string;

  @ApiProperty({ example: ['fist-post-image-link', 'second-post-image-link'] })
  postPhotos: string[];

  static toView(post): CreatedPostView {
    return {
      id: post.id,
      userId: post.userId,
      description: post.description,
      postPhotos: post.Photos,
    };
  }
}
