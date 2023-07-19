export const userEndpoints = {
  default(): string {
    return 'user';
  },

  createPost(test = false): string {
    const endpoint = 'post';
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  getUserProfile(test = false): string {
    const endpoint = '';
    if (test) return `/${this.default()}`;
    return endpoint;
  },

  myPosts(test = false): string {
    const endpoint = 'my-posts'
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  updatePost(test = false, userId?: string): string {
    const endpoint = 'post';
    if (test) return `/${this.default()}/${endpoint}/${userId}`;
    return `endpoint/:userId`;
  },

  updateUserProfile(test = false): string {
    const endpoint = `profile`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  uploadUserAvatar(test = false): string {
    const endpoint = `avatar`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },
};
