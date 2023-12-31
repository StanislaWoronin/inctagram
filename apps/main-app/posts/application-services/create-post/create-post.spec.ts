import { CreatePostCommandHandler } from './create-post.command-handler';
import { PrismaService } from '../../../../../libs/providers/prisma/prisma.service';
import { Observable, of } from 'rxjs';
import { UserIdWith } from '../../../users/dto/id-with.dto';
import { PostImagesDto } from '../../../users/dto/post-images.dto';
import { TestingRepository } from '../../../testing/testing.repository';
import { PostRepository } from '../../../users/db.providers/images/post.repository';

const testUser = {
  userName: 'UserName',
  email: 'somemail@gmail.com',
  createdAt: new Date().toISOString(),
  isConfirmed: true,
};

const expectPhotos = ['some/image1.url', 'some/image2.url', 'some/image3.url'];

const clientProxyMock: any = {
  send(pattern: any, data: any): Observable<any> {
    return of(expectPhotos);
  },
};

const jwtServiceMock: any = {};

describe('Create post.', () => {
  const prismaService = new PrismaService();
  const postRepository = new PostRepository(prismaService);
  const createPostCommandHandler = new CreatePostCommandHandler(
    clientProxyMock,
    postRepository,
  );

  // ***
  const testingRepository = new TestingRepository(
    prismaService,
    jwtServiceMock,
  );

  it('Should create new post.', async () => {
    await testingRepository.deleteAll();
    const user = await testingRepository.createTestingUser(testUser);
    const dto: UserIdWith<PostImagesDto> = {
      userId: user.id,
      description: 'Post description',
      postPhotos: [] as Buffer[],
    };

    const result = await createPostCommandHandler.execute({ dto });
    expect(result).toBeDefined();
    expect(result).toStrictEqual({
      id: expect.any(String),
      userId: dto.userId,
      description: dto.description,
      createdAt: expect.any(String),
      postPhotos: expectPhotos.map((p) => {
        return {
          photoId: expect.any(String),
          photoLink: p,
        };
      }),
    });
  });
});
