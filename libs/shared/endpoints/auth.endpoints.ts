export const authEndpoints = {
  default(): string {
    return 'auth';
  },

  confirmationEmailResending(test = false): string {
    const endpoint = `confirmation-email-resending`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  login(test = false): string {
    const endpoint = `login`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  logout(test = false): string {
    const endpoint = `logout`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  mergeProfile(test = false): string {
    const endpoint = `merge-profile`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  newPassword(test = false): string {
    const endpoint = `new-password`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  registration(test = false): string {
    const endpoint = `registration`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  passwordRecovery(test = false): string {
    const endpoint = `password-recovery`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  passwordRecoveryPage(test = false): string {
    const endpoint = `password-recovery-page`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  pairToken(test = false): string {
    const endpoint = `refresh-token`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },

  registrationConfirmation(test = false): string {
    const endpoint = `registration-confirmation`;
    if (test) return `/${this.default()}/${endpoint}`;
    return endpoint;
  },
};
