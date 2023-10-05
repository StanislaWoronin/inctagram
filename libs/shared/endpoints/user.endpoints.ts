/**
 * Default path: user
 *
 * Endpoints:
 *  - POST post
 *  - POST avatar
 *  - GET me
 *  - GET my-posts
 *  - PUT me
 *  - PUT post
 *  - DELETE post
 */
export const userEndpoints = {
  /**
   * App URI/user
   */
  default(): string {
    return 'user';
  },

  /**
   * Create new post with description
   *
   * App URI/user/post
   */
  createPost(test = false): string {
    const endpoint = 'post';
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   * Upload users avatar
   *
   * App URI/user/avatar
   */
  uploadUserAvatar(test = false): string {
    const endpoint = `avatar`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   * Return users profile with avatar photo
   *
   * App URI/user/me
   */
  getUserProfile(test = false): string {
    const endpoint = 'me';
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   * Return current users posts
   *
   * App URI/user/my-posts
   */
  myPosts(test = false): string {
    const endpoint = 'my-posts';
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   * Update users profile set additional info about users
   *
   * App URI/user/me
   */
  updateUserProfile(test = false): string {
    const endpoint = `me`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   * Update users's post
   *
   * App URI/user/post
   */
  updatePost(test = false, userId?: string): string {
    const endpoint = 'post';
    if (test) return `/${this.default()}/${endpoint}/${userId}`;
    return `${endpoint}/:userId`;
  },

  /**
   * Marks a post as deleted. The post can be restored within a certain time, after which
   * it will be automatically deleted
   *
   * App URI/user/post
   */
  deletePost(test = false, postId?: string): string {
    const endpoint = 'post';
    if (test) return `/${this.default()}/${endpoint}/${postId}`;
    return `${endpoint}/:postId`;
  },
};
