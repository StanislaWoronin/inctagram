import {Injectable} from "@nestjs/common";
import {PrismaService} from "../../../../../libs/providers/prisma/prisma.service";
import {Posts} from "@prisma/client";
import {UserIdWith} from "../../dto/id-with.dto";
import {MyPostQuery} from "../../dto/my-post.query";
import {MyPostsView} from "../../view-model/my-posts.view-model";
import {settings} from "../../../../../libs/shared/settings";

@Injectable()
export class PostQueryRepository {
    constructor(private prisma: PrismaService) {}

    async getPostById(postId): Promise<Posts> {
        return await this.prisma.posts.findUnique({ where: { id: postId } });
    }

    async getMyPosts(dto: UserIdWith<MyPostQuery>): Promise<MyPostsView> {
        const [userPosts] = await this.prisma.user.findMany({
            select: {
                id: true,
                userName: true,
                aboutMe: true,
                Avatar: {
                    select: {
                        photoLink: true,
                    },
                },
                Posts: {
                    select: {
                        id: true,
                        createdAt: true,
                        Photos: {
                            select: {
                                photoLink: true,
                            },
                        },
                    },
                    where: {
                        isDeleted: false,
                    },
                    orderBy: { createdAt: 'desc' },
                    skip: MyPostQuery.getSkipCount(dto.page),
                    take: settings.pagination.pageSize,
                },
            },
            where: {
                id: dto.userId,
            },
        });

        const totalCount = await this.prisma.posts.count({
            where: {
                userId: dto.userId,
                isDeleted: false,
            },
        });

        return MyPostsView.toView(userPosts, dto.page, totalCount);
    }
}