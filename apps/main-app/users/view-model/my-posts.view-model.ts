export class MyPostsView {
    userName: string;
    aboutMe: string;
    userAvatar: string;
    posts: string[] | [];

    static toView(userPosts) {
        return {
            userName: userPosts.userName,
            aboutMe: userPosts.aboutMe,
            userAvatar: userPosts.Avatar.userAvatar,
            posts: userPosts.Posts.Avatar.photoLink
        }
    }
}