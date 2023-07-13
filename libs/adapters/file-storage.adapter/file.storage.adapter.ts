import { Injectable } from '@nestjs/common';
import {
  DeleteObjectsCommand,
  ListObjectsCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { RpcException } from '@nestjs/microservices';
import {cloudSwitcher} from "./cloud.switcher";

@Injectable()
export class S3StorageAdapter {
  s3Client: S3Client;
  bucketName: string;
  constructor(private configService: ConfigService) {
    const cloudOptions = cloudSwitcher()
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
    const command = new PutObjectCommand(bucketParams);
    try {
      await this.s3Client.send(command);
    } catch (e) {
      throw new Error(e);
    }
    return {
      photoLink: `https://userimagesbucketinc.s3.eu-central-1.amazonaws.com/${bucketParams.Key}`,
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
}
