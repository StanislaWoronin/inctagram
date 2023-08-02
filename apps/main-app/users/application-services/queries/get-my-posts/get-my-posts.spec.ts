import { GetMyPostsQuery } from './get-my-posts.query';
import { PrismaService } from '../../../../../../libs/providers/prisma/prisma.service';
import { UserQueryRepository } from '../../../db.providers/users/user.query-repository';
import { TestingRepository } from '../../../../testing/testing.repository';
import { response } from 'express';
import {
  checkSortingOrder,
  countPageElements,
} from '../../../../../../test/helpers';
import { PostQueryRepository } from '../../../db.providers/images/post.query-repository';

const testData = {
  userName: 'UserName',
  email: 'somemail@gmail.com',
  createdAt: new Date().toISOString(),
  description: 'Post description',
  postImagesLink: ['some/image1.link', 'some/image2.link'],
};

const jwtServiceMock: any = {};

describe('Get my posts.', () => {
  const prismaService = new PrismaService();
  const postQueryRepository = new PostQueryRepository(prismaService);
  const getMyPostsQuery = new GetMyPostsQuery(postQueryRepository);

  const testingRepository = new TestingRepository(
    prismaService,
    jwtServiceMock,
  );

  const postCount = 12;
  it('Return fist page with users posts.', async () => {
    await testingRepository.deleteAll();
    const [createdData] = await testingRepository.createTestingPost(
      testData,
      postCount,
    );

    const dto = {
      userId: createdData.id,
      page: 1,
    };

    const result = await getMyPostsQuery.execute({ dto });
    expect(response).toBeDefined();
    expect(result).toEqual({
      id: createdData.id,
      userName: testData.userName,
      aboutMe: null,
      userAvatar: null,
      posts: expect.any(Array),
      currentPage: dto.page,
      postsCount: postCount,
    });
    const pageElements = countPageElements(postCount);
    expect(result.posts.length).toBe(pageElements);

    const isDescending = checkSortingOrder(result.posts);
    expect(isDescending).toEqual(true);

    expect.setState({
      userId: createdData.id,
    });
  }, 10000);

  it('Should return second page with users post.', async () => {
    const { userId } = expect.getState();

    const dto = {
      userId: userId,
      page: 2,
    };

    const result = await getMyPostsQuery.execute({ dto });
    expect(response).toBeDefined();
    expect(result).toEqual({
      id: userId,
      userName: testData.userName,
      aboutMe: null,
      userAvatar: null,
      posts: expect.any(Array),
      currentPage: dto.page,
      postsCount: postCount,
    });
    expect(result.posts.length).toBe(countPageElements(postCount, dto.page));

    const isDescending = checkSortingOrder(result.posts);
    expect(isDescending).toEqual(true);
  }, 10000);
});
