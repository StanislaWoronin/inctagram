import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TFileStorageConfig } from './file-storage-config.type';
import { EnvironmentName } from '../../../libs/shared/enums/environment-name.enum';
import { CloudName } from '../../../libs/shared/enums/cloud-name.enum';

@Injectable()
export class FileStorageConfig {
  private readonly logger = new Logger(FileStorageConfig.name);

  configInit(configService: ConfigService): TFileStorageConfig {
    // Cloud
    const cloudName = configService.get(EnvironmentName.CloudName) ?? 'YC';
    const cloud: any = {};
    if (cloudName === CloudName.Aws) {
      cloud.region =
        configService.get(EnvironmentName.AwsRegion) ?? 'eu-central-1';
      cloud.baseUrl =
        configService.get(EnvironmentName.AwsBaseUrl) ??
        'https://s3.eu-central-1.amazonaws.com';
      cloud.bucketName = configService.get(EnvironmentName.AwsBucketName);
      if (!cloud.bucketName)
        this.logger.warn('Aws cloud bucket name not found!');
      cloud.accessKey = configService.get(EnvironmentName.AwsAccessKeyId);
      if (!cloud.accessKey) this.logger.warn('Aws access key not found!');
      cloud.secretKey = configService.get(EnvironmentName.AwsAccessSecretKey);
      if (!cloud.secretKey) this.logger.warn('Aws secret key not found!');
    } else {
      cloud.region = configService.get(EnvironmentName.YCRegion) ?? 'us-east-1';
      cloud.baseUrl =
        configService.get(EnvironmentName.YCBaseUrl) ??
        'https://storage.yandexcloud.net';
      cloud.bucketName = configService.get(EnvironmentName.YCBucketName);
      if (!cloud.bucketName)
        this.logger.warn('Yandex cloud bucket name not found!');
      cloud.accessKey = configService.get(EnvironmentName.YCAccessKeyId);
      if (!cloud.accessKey)
        this.logger.warn('Yandex cloud access key not found!');
      cloud.secretKey = configService.get(EnvironmentName.YCAccessSecretKey);
      if (!cloud.secretKey)
        this.logger.warn('Yandex cloud secret key not found!');
    }

    return cloud;
  }
}
