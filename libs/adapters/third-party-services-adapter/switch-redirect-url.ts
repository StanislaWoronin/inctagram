import { settings } from '../../shared/settings';

export const switchRedirectUrl = () => {
  return settings.environment !== 'development'
    ? settings.oauth.REDIRECT_URL
    : settings.oauth.LOCAL_REDIRECT_URL;
};
