import { Injectable } from '@nestjs/common';
import { TestingRepository } from './testing.repository';

@Injectable()
export class TestingService {
  constructor(private testingRepository: TestingRepository) {}

  async createUser(
    count: number,
    isConfirmed: boolean,
    isExpired = false,
    startWith = 0,
  ) {
    for (let i = 0; i < count; i++) {
      const code = Date.now().toString();
      const user = {
        userName: `${i + startWith + 1}UserName`,
        email: `${i + startWith + 1}somemail@gmail.com`,
        createdAt: new Date().toISOString(),
        isConfirmed,
      };

      const createdUser =
        await this.testingRepository.createUserWithConfirmationCode(user);
      if (isExpired) {
        await Promise.all([
          this.testingRepository.makeEmailConfirmationExpired(
            createdUser.id,
            code,
          ),
          this.testingRepository.makePasswordRecoveryExpired(
            createdUser.id,
            code,
          ),
        ]);
      }
    }
    return;
  }
}
