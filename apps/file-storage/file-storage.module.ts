import {Module} from '@nestjs/common';
import {FileStorageController} from './file-storage.controller';
import {ClientsModule} from '@nestjs/microservices';
import {getProviderOptions} from '../../libs/providers/rabbit-mq/providers.option';
import {CqrsModule} from '@nestjs/cqrs';
import {SharedModule} from '../../libs/shared/shared.module';
import {Microservices} from '../../libs/shared/enums/microservices-name.enum';
import {
  FILE_STORAGE_COMMANDS_HANDLERS,
  FILE_STORAGE_QUERIES_HANDLERS,
  FileStorageFacade,
} from './application-services';
import {S3StorageAdapter} from '../../libs/adapters/file-storage.adapter/file.storage.adapter';

@Module({
  imports: [
    CqrsModule,
    SharedModule,
    ClientsModule.register([getProviderOptions(Microservices.FileStorage)]),
  ],
  controllers: [FileStorageController],
  providers: [
    FileStorageFacade,
    ...FILE_STORAGE_COMMANDS_HANDLERS,
    ...FILE_STORAGE_QUERIES_HANDLERS,
    S3StorageAdapter,
  ],
  exports: [],
})
export class FileStorageModule {}
