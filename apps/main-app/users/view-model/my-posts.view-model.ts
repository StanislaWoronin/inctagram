import { toViewPhotoLink } from '../../../../libs/shared/helpers';
import { ApiProperty } from '@nestjs/swagger';

class Posts {
  @ApiProperty()
  postId: string;

  @ApiProperty()
  createdAt: string;

  @ApiProperty()
  photosLink: string[];
}

export class MyPostsView {
  @ApiProperty({ description: 'User ID.' })
  id: string;

  @ApiProperty({ description: 'User Login.', example: 'UserLogin' })
  userName: string;

  @ApiProperty({ description: 'Brief information about the users.' })
  aboutMe: string;

  @ApiProperty({ description: 'User avatar link.' })
  userAvatar: string;

  @ApiProperty({ type: [Posts] })
  posts: Posts[];

  @ApiProperty()
  currentPage: number;

  @ApiProperty()
  postsCount: number;

  static toView(userPosts, page: number, totalCount: number): MyPostsView {
    return {
      id: userPosts.id,
      userName: userPosts.userName,
      aboutMe: userPosts.aboutMe ?? null,
      userAvatar: userPosts.Avatar?.userAvatar ?? null,
      posts: userPosts.Posts?.map((p) => {
        return {
          postId: p.id,
          createdAt: p.createdAt,
          photosLink: p.Photos?.map((pl) => toViewPhotoLink(pl.photoLink)),
        };
      }),
      currentPage: page,
      postsCount: totalCount,
    };
  }
}
