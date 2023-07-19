import { toViewPhotoLink } from '../../../../libs/shared/helpers';

export class MyPostsView {
  userName: string;
  aboutMe: string;
  userAvatar: string;
  posts: {
    postId: string;
    photosLink: string[];
  };
  postsCount: number;

  static toView(userPosts, totalCount: number): MyPostsView {
    return {
      userName: userPosts.userName,
      aboutMe: userPosts.aboutMe ?? null,
      userAvatar: userPosts.Avatar?.userAvatar ?? null,
      posts: userPosts.Posts.map((p) => {
        return {
          postId: p.id,
          photosLink: p.Photos.map((pl) => toViewPhotoLink(pl.photoLink)),
        };
      }),
      postsCount: totalCount,
    };
  }
}
