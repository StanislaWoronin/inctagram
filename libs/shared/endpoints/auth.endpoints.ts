/**
 * Default path: auth
 *
 * Endpoints:
 *  - POST confirmation-email-resending
 *  - POST login
 *  - POST logout
 *  - POST new-password
 *  - POST password-recovery
 *  - POST refresh-token
 *  - POST registration
 *  - POST github-registration
 *  - POST google-registration
 *  - GET registration-confirmation
 *  - PUT merge
 */
export const authEndpoints = {
  /** App URI/auth */
  default(): string {
    return 'auth';
  },

  /**
   * Re-sends registration confirmation code
   *
   * App URI/auth/confirmation-email-resending
   */
  confirmationEmailResending(test = false): string {
    const endpoint = `confirmation-email-resending`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   * Login user into the system
   *
   * App URI/auth/login
   */
  login(test = false): string {
    const endpoint = `login`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   * Disconnect the current user session
   *
   * App URI/auth/logout
   */
  logout(test = false): string {
    const endpoint = `logout`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   *
   * If the email to which the third-party resource is unregistered
   * already exists in the system and is not confirmed, you can
   * overwrite the profile using the data of the third-party resource
   *
   * App URI/auth/merge
   */
  mergeProfile(test = false): string {
    const endpoint = `merge`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   * Overwrites the user's new password
   *
   * App URI/auth/new-password
   */
  newPassword(test = false): string {
    const endpoint = `new-password`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   * Re-sends password recovery code
   *
   * App URI/auth/password-recovery
   */
  passwordRecovery(test = false): string {
    const endpoint = `password-recovery`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   * Generates a new pair of tokens
   *
   * App URI/auth/refresh-token
   */
  pairToken(test = false): string {
    const endpoint = `refresh-token`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   * Registers a user in the system
   *
   * App URI/auth/registration
   */
  registration(test = false): string {
    const endpoint = `registration`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   * Registers a user in the system via GitHub
   *
   * App URI/auth/github-registration
   */
  registrationViaGitHub(test = false): string {
    const endpoint = 'github-registration';
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   * Registers a user in the system via Google
   *
   * App URI/auth/google-registration
   */
  registrationViaGoogle(test = false): string {
    const endpoint = 'google-registration';
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  /**
   * The endpoint to which the user follows the link when confirming
   * registration
   *
   * App URI/auth/registration-confirmation
   */
  registrationConfirmation(test = false): string {
    const endpoint = `registration-confirmation`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },
};
