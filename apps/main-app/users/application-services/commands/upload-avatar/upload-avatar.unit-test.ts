// Импортируем необходимые зависимости и типы
import { UploadUserAvatarCommand } from './UploadUserAvatarCommand'; // Путь к команде, которую хэндлер обрабатывает
import { UploadAvatarCommandHandler } from './UploadAvatarCommandHandler';
import { ClientProxy } from '@nestjs/microservices';
import { FileStorageRepository } from './FileStorageRepository';
import { lastValueFrom, of } from 'rxjs';

// Mock для ClientProxy
const clientProxyMock: Partial<ClientProxy> = {
  send: jest.fn(() => of('http://example.com/avatar-link')), // Мокируем результат отправки запроса
};

// Mock для FileStorageRepository
const fileStorageRepositoryMock: Partial<FileStorageRepository> = {
  deleteOldAvatar: jest.fn(),
  saveImage: jest.fn(),
};

// Тесты
describe('UploadAvatarCommandHandler', () => {
  let handler: UploadAvatarCommandHandler;

  beforeEach(() => {
    handler = new UploadAvatarCommandHandler(
      clientProxyMock as ClientProxy,
      fileStorageRepositoryMock as FileStorageRepository,
    );
  });

  it('should upload and save avatar', async () => {
    // Mock данные для команды
    const dto = {
      userId: 'user123',
      avatarData: 'avatar_data',
    };

    // Выполняем команду
    const result = await handler.execute({ dto });

    // Проверяем, что был вызван метод deleteOldAvatar с нужным userId
    expect(fileStorageRepositoryMock.deleteOldAvatar).toHaveBeenCalledWith(
      dto.userId,
    );

    // Проверяем, что был вызван метод saveImage с нужными параметрами
    expect(fileStorageRepositoryMock.saveImage).toHaveBeenCalledWith(
      dto.userId,
      'http://example.com/avatar-link',
    );

    // Проверяем, что результат команды вернулся корректно
    expect(result).toBe(true);
  });
});
