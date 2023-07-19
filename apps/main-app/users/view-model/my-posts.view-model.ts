export class MyPostsView {
    postId: string;
    userName: string;
    aboutMe: string;
    userAvatar: string;
    posts: string[] | [];

    static toView(userPosts) {
        return {
            postId: userPosts.id,
            userName: userPosts.userName,
            aboutMe: userPosts.aboutMe,
            userAvatar: userPosts.Avatar.userAvatar,
            posts: userPosts.Posts.Avatar.photoLink
        }
    }
}