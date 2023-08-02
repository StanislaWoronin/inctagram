import { PrismaService } from '../providers/prisma/prisma.service';
import { TaskService } from './task.service';
import { TestingService } from '../../apps/main-app/testing/testing.service';
import { TestingRepository } from '../../apps/main-app/testing/testing.repository';
import { PostRepository } from '../../apps/main-app/users/db.providers/images/post.repository';
import { TaskRepository } from './task.repository';
import { JwtService } from '@nestjs/jwt';

describe('Test task service.', () => {
  // let postRepository: PostRepository;
  // let taskService: TaskService;
  // let testingService: TestingService;
  // let testingRepository: TestingRepository;
  //
  // beforeEach(async () => {
  //   const moduleRef = await Test.createTestingModule({
  //     providers: [
  //       PostRepository,
  //       PrismaService,
  //       TaskService,
  //       TestingService,
  //       TestingRepository,
  //     ],
  //   }).compile();
  //
  //   postRepository = moduleRef.get<PostRepository>(PostRepository);
  //   taskService = moduleRef.get<TaskService>(TaskService);
  //   testingService = moduleRef.get<TestingService>(TestingService);
  //   testingRepository = moduleRef.get<TestingRepository>(TestingRepository);
  // });

  const prisma = new PrismaService();
  const taskRepository = new TaskRepository(prisma);
  const taskService = new TaskService(taskRepository);
  const postRepository = new PostRepository(prisma);

  const testingRepository = new TestingRepository(prisma, {} as JwtService);
  const testingService = new TestingService(testingRepository);

  describe('Test delete expired email confirmation code or password recovery code.', () => {
    const count = 5;
    beforeAll(async () => {
      await testingRepository.deleteAll();

      await Promise.all([
        testingService.createUser(count, false, true), // Must be deleted
        testingService.createUser(count, false, false, count * 2),
        testingService.createUser(count, true, true, count * 3), // Must be deleted
      ]);
    });

    it('Should delete expired email confirmation code.', async () => {
      await taskService.clearExpiredConfirmationCode();

      const users = await testingRepository.getUsers();
      expect(users.length).toBe(count * 3);

      const emailConfirmationCount =
        await testingRepository.getEmailConfirmationsCount();
      expect(emailConfirmationCount).toBe(count);
    });

    it('Should delete expired password recovery code.', async () => {
      await taskService.clearExpiredPasswordRecovery();

      const users = await testingRepository.getUsers();
      expect(users.length).toBe(count * 3);

      const emailConfirmationCount =
        await testingRepository.getPasswordRecoveryCodeCount();
      expect(emailConfirmationCount).toBe(count);
    });
  });

  describe('Test delete depricated post.', () => {
    it('Should delete depricated post.', async () => {
      await testingRepository.deleteAll();

      const testData = {
        userName: 'UserName',
        email: 'somemail@gmail.com',
        createdAt: new Date().toISOString(),
        description: 'Post description',
        postImagesLink: ['some/image1.link', 'some/image2.link'],
      };

      const userCount = 4;
      const postCount = 2;
      const userWithPosts = await testingRepository.createTestingPost(
        testData,
        userCount,
        postCount,
      );

      for (let i = 0; i < userCount / 2; i++) {
        for (let j = 0; j < postCount; j++) {
          const postId = userWithPosts[i].Posts[j].id;
          await postRepository.updateDeleteStatus({
            postId,
            isDeleted: true,
          });

          await testingRepository.createExpiredReasonDeletingPost(postId);
        }
      }

      await taskService.deleteDepricatedPost();
      const postCountAfterClear = await testingRepository.getPostCount();
      expect(postCountAfterClear).toBe((userCount * postCount) / 2);
      const deletedPostInfoCountAfterClear =
        await testingRepository.deletedPostInfoCount();
      expect(deletedPostInfoCountAfterClear).toBe(0);
      const postPhotoCountAfterClear = await testingRepository.postPhotoCount();
      expect(postPhotoCountAfterClear).toBe(userCount * postCount);
    });
  });
});
