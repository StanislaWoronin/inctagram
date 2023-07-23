import { Injectable } from '@nestjs/common';
import {
  DeleteObjectCommand,
  DeleteObjectsCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { RpcException } from '@nestjs/microservices';
import { cloudSwitcher } from './cloud.switcher';
import { randomUUID } from 'crypto';
import { PhotoType } from '../../shared/enums/photo-type.enum';

@Injectable()
export class S3StorageAdapter {
  s3Client: S3Client;
  bucketName: string;
  constructor() {
    const cloudOptions = cloudSwitcher();
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
    imageType: string,
    buffer: Buffer,
  ): Promise<{ photoLink: string }> {
    const bucketParams = {
      Bucket: this.bucketName,
      Key: `${userId}/${imageType}/${randomUUID()}`,
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

  public async saveFiles(
    userId: string,
    imageType: PhotoType,
    buffers: Buffer[],
  ): Promise<string[]> {
    const photoLinks: string[] = [];
    const postId = randomUUID();
    for (const buffer of buffers) {
      const imageId = randomUUID();
      const bucketParams = {
        Bucket: this.bucketName,
        Key: `${userId}/${imageType}/${postId}/${imageId}`,
        Body: buffer,
        ContentType: 'image/png',
      };

      try {
        const command = new PutObjectCommand(bucketParams);
        await this.s3Client.send(command);
        photoLinks.push(bucketParams.Key);
      } catch (e) {
        throw new Error(e);
      }
    }

    return photoLinks;
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
      if (!listObjectsOutput.Contents) {
        return;
      }

      const deleteObjectsParams = {
        Bucket: bucketName,
        Delete: { Objects: [] },
      };
      if (listObjectsOutput.Contents.length > 0) {
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
