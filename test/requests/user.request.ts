import request from 'supertest';
import {TestResponseType} from '../types/test-response.type';
import {ErrorResponse} from '../../libs/shared/errors.response';
import {join} from 'path';
import {Images, images} from '../images/images';
import {ViewUserWithInfo} from '../../apps/main-app/users/view-model/user-with-info.view-model';
import {fileStorageConstants} from '../../apps/file-storage/image-validator/file-storage.constants';
import {userEndpoints} from '../../libs/shared/endpoints/user.endpoints';
import {TUpdateUserProfileTestDto} from '../types/update-user-profile.test-dto';
import sharp from "sharp";

export class UserRequest {
  constructor(private readonly server: any) {}

  async updateUserProfile(
    dto: TUpdateUserProfileTestDto,
    accessToken?: string,
  ): Promise<TestResponseType<ErrorResponse>> {
    const response = await request(this.server)
      .put(userEndpoints.updateUserProfile(true))
      .auth(accessToken, { type: 'bearer' })
      .send(dto);

    return { body: response.body, status: response.status };
  }

  async getUserProfile(
    accessToken?: string,
  ): Promise<TestResponseType<ViewUserWithInfo>> {
    const response = await request(this.server)
      .get(userEndpoints.getUser(true))
      .auth(accessToken, { type: 'bearer' });

    return { body: response.body, status: response.status };
  }

  async uploadUserAvatar(
    imageName: Images,
    accessToken?: string,
  ): Promise<TestResponseType<ErrorResponse>> {
    if (!accessToken) {
      const response = await request(this.server)
        .post(userEndpoints.uploadUserAvatar(true))
        .auth(accessToken, { type: 'bearer' });

      return { body: response.body, status: response.status };
    }

    await sharp()
    const imagePath = join(
      __dirname,
      '..',
      'images',
      'avatar',
      images[imageName],
    );

    const response = await request(this.server)
      .post(userEndpoints.uploadUserAvatar(true))
      .auth(accessToken, { type: 'bearer' })
      .attach(fileStorageConstants.avatar.name, imagePath);

    return { status: response.status, body: response.body };
  }
}
