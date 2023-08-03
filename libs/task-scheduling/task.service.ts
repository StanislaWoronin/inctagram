import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { TaskRepository } from './task.repository';
import { config } from '../../apps/main-app/main';

@Injectable()
export class TaskService {
  constructor(private taskRepository: TaskRepository) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearExpiredConfirmationCode() {
    await this.taskRepository.clearEmailConfirmation();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async clearExpiredPasswordRecovery() {
    return await this.taskRepository.clearPasswordRecovery();
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteDeprecatedPost() {
    return await this.taskRepository.deleteDeprecatedPost();
  }
}
