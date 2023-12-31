import { TestingRepository } from '../../../testing/testing.repository';
import { PrismaService } from '../../../../../libs/providers/prisma/prisma.service';
import { UpdatePostCommandHandler } from './update-post.command-handler';
import { UserRepository } from '../../../users/db.providers/users/user.repository';
import { UserIdWith } from '../../../users/dto/id-with.dto';
import { UpdatePostDto } from '../../../users/dto/update-post.dto';
import { PostRepository } from '../../../users/db.providers/images/post.repository';

const testData = {
  userName: 'UserName',
  email: 'somemail@gmail.com',
  createdAt: new Date().toISOString(),
  description: 'Post description',
  postImagesLink: ['some/image1.link', 'some/image2.link'],
};

const jwtServiceMock: any = {};

describe('Update post.', () => {
  const prismaService = new PrismaService();
  const postRepository = new PostRepository(prismaService);
  const updatePostCommandHandler = new UpdatePostCommandHandler(postRepository);

  const testingRepository = new TestingRepository(
    prismaService,
    jwtServiceMock,
  );

  it('Should update post and set new description', async () => {
    await testingRepository.deleteAll();
    const [createdData] = await testingRepository.createTestingPost(testData);
    const postId = createdData.Posts[0].id;

    const dto: UserIdWith<UpdatePostDto> = {
      userId: createdData.id,
      postId,
      description: 'New post description',
    };

    await updatePostCommandHandler.execute({ dto });

    const updatedPost = await testingRepository.getPost(postId);
    expect(updatedPost.description).not.toBe(testData.description);
    expect(updatedPost.description.split(' ')[0]).toBe('New');

    expect.setState({
      createdData,
      postId,
    });
  });

  it('Should update post and delete description.', async () => {
    const { createdData, postId } = expect.getState();
    const dto: UserIdWith<UpdatePostDto> = {
      userId: createdData.id,
      postId,
    };

    await updatePostCommandHandler.execute({ dto });

    const updatedPost = await testingRepository.getPost(postId);
    expect(updatedPost.description).not.toBe(testData.description);
    expect(updatedPost.description.split(' ')[0]).toBe('New');
  });
});
