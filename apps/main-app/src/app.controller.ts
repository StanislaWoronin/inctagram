import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { ApiExcludeEndpoint } from '@nestjs/swagger';
import {
  ApiDropDatabase,
  GetUserFromDatabaseTest,
} from '../../../libs/documentation/swagger/auth.documentation';
import { TestingRepository } from './testing.repository';
import { testingEndpoints } from '../../../libs/shared/endpoints/testing.endpoints';

@Controller()
export class AppController {
  constructor(private readonly testingRepository: TestingRepository) {}

  @Get()
  @ApiExcludeEndpoint()
  async mainEntry() {
    return 'Welcome to INCTAGRAM API!!!';
  }

  @Delete(testingEndpoints.deleteAll())
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiDropDatabase()
  async deleteAll() {
    return await this.testingRepository.deleteAll();
  }

  @Get(testingEndpoints.getUserTest())
  @HttpCode(HttpStatus.OK)
  @GetUserFromDatabaseTest()
  async getUserTest(@Param('data') data: string) {
    return await this.testingRepository.getUser(data);
  }
}
