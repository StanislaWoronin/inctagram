export const testingEndpoints = {
  default(): string {
    return 'testing';
  },

  deleteAll(test = false): string {
    const url = `${this.default()}/delete-all`;
    if (test) return `/${url}`;
    return url;
  },

  getUserTest(test = false, data?: string): string {
    const url = `${this.default()}/users`;
    if (test) return `/${url}/${data}`;
    return `${url}/:data`;
  },
};
