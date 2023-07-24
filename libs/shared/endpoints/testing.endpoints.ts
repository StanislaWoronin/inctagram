export const testingEndpoints = {
  default(): string {
    return 'testing';
  },

  deleteAll(test = false): string {
    const endpoint = `delete-all`;
    if (test) return `/${this.default}/${endpoint}`;
    return endpoint;
  },

  getUserTest(test = false, data?: string): string {
    const endpoint = `users`;
    if (test) return `/${this.default}/${endpoint}/${data}`;
    return `${endpoint}/:data`;
  },
};
