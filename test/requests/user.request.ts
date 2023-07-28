import request from 'supertest';
import { TestResponseType } from '../types/test-response.type';
import { ErrorResponse } from '../../libs/shared/errors.response';
import { join } from 'path';
import { Images, images } from '../images/images';
import { ViewUserWithInfo } from '../../apps/main-app/users/view-model/user-with-info.view-model';
import { fileStorageConstants } from '../../apps/file-storage/image-validator/file-storage.constants';
import { userEndpoints } from '../../libs/shared/endpoints/user.endpoints';
import { TUpdateUserProfileTestDto } from '../types/update-user-profile.test-dto';
import { createReadStream, readFile, readFileSync } from 'fs';
//import FormData from 'form-data';
import { fileToBuffer } from '../helpers';
import axios from 'axios';
import { log } from 'util';

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
      .get(userEndpoints.getUserProfile(true))
      .auth(accessToken, { type: 'bearer' });

    return { body: response.body, status: response.status };
  }

  async uploadUserAvatar(
    imageName: Images,
    accessToken?: string,
  ): Promise<TestResponseType<ErrorResponse>> {
    const imagePath = join(
      __dirname,
      '..',
      'images',
      'avatar',
      images.avatar[imageName],
    );

    // const response = await request(this.server)
    //   .post(userEndpoints.uploadUserAvatar(true))
    //   .auth(accessToken, { type: 'bearer' })
    //   .set('Content-Type', 'multipart/form-data')
    //   .attach('avatar', imagePath);
    const formData = new FormData();
    formData.append('avatar', imagePath);

    const response = await axios.post(
      'http://localhost:5000/user/avatar',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );
    // @ts-ignore
    console.log(response.body);
    return { status: response.status, body: response.data };
  }
}
