import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { RpcException } from '@nestjs/microservices';
import { cloudSwitcher } from './cloud.switcher';

@Injectable()
export class S3StorageAdapter {
  s3Client: S3Client;
  bucketName: string;
  constructor() {
    const cloudOptions = cloudSwitcher();
    console.log(cloudOptions);
    this.s3Client = new S3Client({
      region: cloudOptions.REGION,
      credentials: {
        accessKeyId: cloudOptions.ACCESS_KEY_ID,
        secretAccessKey: cloudOptions.SECRET_ACCESS_KEY,
      },
      endpoint: cloudOptions.BASE_URL,
    });
    this.bucketName = cloudOptions.BUCKET_NAME;
  }

  public async saveFile(
    userId: string,
    typeImageDir: string,
    buffer: Buffer,
  ): Promise<{ photoLink: string }> {
    const bucketParams = {
      Bucket: this.bucketName,
      Key: `${userId}/${typeImageDir}/${uuidv4()}`,
      Body: buffer,
      ContentType: 'image/png',
    };
    try {
      const command = new PutObjectCommand(bucketParams);
      await this.s3Client.send(command);
    } catch (e) {
      throw new Error(e);
    }
    return {
      photoLink: bucketParams.Key,
    };
  }

  public async deleteFolder(
    bucketName: string,
    folderPath: string,
  ): Promise<void> {
    try {
      const listObjectsParams = {
        Bucket: bucketName,
        Prefix: folderPath,
      };
      const listObjectsCommand = new ListObjectsCommand(listObjectsParams);
      const listObjectsOutput = await this.s3Client.send(listObjectsCommand);

      const deleteObjectsParams = {
        Bucket: bucketName,
        Delete: { Objects: [] },
      };
      if (!listObjectsOutput.Contents) {
        return;
      }

      if (listObjectsOutput && listObjectsOutput.Contents.length > 0) {
        listObjectsOutput.Contents.forEach((content) => {
          deleteObjectsParams.Delete.Objects.push({ Key: content.Key });
        });

        const deleteObjectsCommand = new DeleteObjectsCommand(
          deleteObjectsParams,
        );
        await this.s3Client.send(deleteObjectsCommand);
      }
    } catch (error) {
      console.error('An error occurred while deleting the folder:', error);
      throw new RpcException(error);
    }
  }

  async deleteImage(url: string) {
    const bucketParams = {
      Bucket: this.bucketName,
      Key: url,
    };

    try {
      const data = await this.s3Client.send(
        new DeleteObjectCommand(bucketParams),
      );
      return data;
    } catch (exception) {
      console.error('Delete error:', exception);
      throw exception;
    }

    return;
  }
}
