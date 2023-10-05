/**
 * Default path: testing
 *
 * Endpoints:
 *  - Delete delete-all
 *  - GET users
 */
export const testingEndpoints = {
  /**
   * App URI/testing
   */
  default(): string {
    return 'testing';
  },

  /**
   * Clear data base
   *
   * App URI/testing/delete-all
   */
  deleteAll(test = false): string {
    const endpoint = `delete-all`;
    if (test) return `/${this.default}/${endpoint}`;
    return endpoint;
  },

  /**
   * Clear return full user
   *
   * App URI/testing/users
   */
  getUserTest(test = false, data?: string): string {
    const endpoint = `users`;
    if (test) return `/${this.default}/${endpoint}/${data}`;
    return `${endpoint}/:data`;
  },

  /**
   * Delete user by field
   *
   * App URI/testing/user/:id
   */
  delete(data?: string, test = false): string {
    const endpoint = `user`;
    if (test) return `/${this.default}/${endpoint}/${data}`;
    return `endpoint/:data`;
  },
};
