import { Posts } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

class PostPhotos {
  @ApiProperty({ example: 'Photo ID.' })
  photoId: string;

  @ApiProperty({ example: 'post-image-link' })
  photoLink: string;
}

type TCreatedPost = Omit<Posts, 'Photos' | 'isDeleted' | 'createdAt'> & {
  postPhotos: PostPhotos[];
};

export class CreatedPostView implements TCreatedPost {
  @ApiProperty({ example: 'Post ID.' })
  id: string;

  @ApiProperty({ example: 'Post owner ID.' })
  userId: string;

  @ApiProperty({ example: 'Some post description.' })
  description: string;

  @ApiProperty({ example: new Date().toISOString() })
  createdAt: string;

  @ApiProperty({ example: ['fist-post-image-link', 'second-post-image-link'] })
  postPhotos: PostPhotos[];

  static toView(post): CreatedPostView {
    return {
      id: post.id,
      userId: post.userId,
      description: post.description,
      createdAt: post.createdAt,
      postPhotos: post.Photos.map((p) => {
        return {
          photoId: p.id,
          photoLink: p.photoLink,
        };
      }),
    };
  }
}
