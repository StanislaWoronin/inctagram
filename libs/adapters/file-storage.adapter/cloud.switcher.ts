import { settings } from '../../shared/settings';
import { CloudName } from '../../shared/enums/cloud-name.enum';

type TCloudOptions = {
  REGION: string;
  BASE_URL: string;
  BUCKET_NAME: string;
  ACCESS_KEY_ID: string;
  SECRET_ACCESS_KEY: string;
};

export const cloudSwitcher = (): TCloudOptions => {
  switch (settings.cloud.cloudName) {
    case CloudName.YandexCloud:
      return settings.cloud.YandexCloud;
    case CloudName.Aws:
      return settings.cloud.AWS;
  }
};
