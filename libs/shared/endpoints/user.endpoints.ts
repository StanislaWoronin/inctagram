export const userEndpoints = {
  default(): string {
    return 'user';
  },

  getUserProfile(test = false): string {
    const endpoint = ``;
    if (test) return `/${this.default()}`;
    return endpoint;
  },

  updateUserProfile(test = false): string {
    const endpoint = `update-profile`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  uploadUserAvatar(test = false): string {
    const endpoint = `upload-avatar`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },
};
