import { PrismaService } from '../../../../../../libs/providers/prisma/prisma.service';
import { UserRepository } from '../../../db.providers/users/user.repository';
import { DeletePostCommandHandler } from './delete-post.command-handler';
import { TestingRepository } from '../../../../testing/testing.repository';
import { UserQueryRepository } from '../../../db.providers/users/user.query-repository';
import { PostRepository } from '../../../db.providers/images/post.repository';
import { PostQueryRepository } from '../../../db.providers/images/post.query-repository';

const testData = {
  userName: 'UserName',
  email: 'somemail@gmail.com',
  createdAt: new Date().toISOString(),
  description: 'Post description',
  postImagesLink: ['some/image1.link', 'some/image2.link'],
};

const jwtServiceMock: any = {};

describe('Delete post.', () => {
  const prismaService = new PrismaService();
  const postRepository = new PostRepository(prismaService);
  const postQueryRepository = new PostQueryRepository(prismaService);
  const deletePostCommandHandler = new DeletePostCommandHandler(
    postRepository,
    postQueryRepository,
  );

  const testingRepository = new TestingRepository(
    prismaService,
    jwtServiceMock,
  );

  it('Should delete post.', async () => {
    await testingRepository.deleteAll();
    const createdData = await testingRepository.createTestingPost(testData);
    const postId = createdData.Posts[0].id;

    const dto = {
      postId,
      isDeleted: true,
    };

    await deletePostCommandHandler.execute({ dto });
    const deletedPost = await testingRepository.getPost(postId);
    expect(deletedPost.isDeleted).toBe(true);

    expect.setState({
      postId,
    });
  });

  it('Nothing should happen.', async () => {
    const { postId } = expect.getState();
    const dto = {
      postId,
      isDeleted: true,
    };

    await deletePostCommandHandler.execute({ dto });
    const deletedPost = await testingRepository.getPost(postId);
    expect(deletedPost.isDeleted).toBe(true);
  });

  it('Nothing should happen.', async () => {
    const { postId } = expect.getState();
    const dto = {
      postId,
      isDeleted: false,
    };

    await deletePostCommandHandler.execute({ dto });
    const deletedPost = await testingRepository.getPost(postId);
    expect(deletedPost.isDeleted).toBe(false);
  });
});
