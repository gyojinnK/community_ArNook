/// <reference types="vite/client" />

import { Timestamp } from "firebase/firestore";
import { Url } from "url";

interface AuthContextType {
    state: { isLogin: boolean; email: string };
    actions: {
        setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
        setEmail: React.Dispatch<React.SetStateAction<string>>;
    };
}

type AuthState =
    | { state: "loaded"; isAuth: boolean; user: User | null }
    | { state: "error"; error: Error };

type UserInfo = {
    nickName: string | null;
    password: string | null;
    profileImage: string | null;
    greet: string | null;
};

type Post = {
    postId: string;
    email: string;
    postTitle: string;
    postHashtags: string[];
    postContent: string;
    extraLink: string | null;
    likeCount: number;
    commentCount: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

type VideoData = {
    url: string | null;
    secureUrl: string | null;
    type: string | null;
    width: string | null;
    height: string | null;
};

type OGData = {
    url: string;
    title: string;
    siteName: string | null;
    description: string | null;
    mediaType: string;
    contentType: string | null;
    images: string[];
    videos: VideoData[];
    favicons: string[];
    charset: string | null;
};

type CommentData = {
    writerEmail: string;
    postId: string;
    commentId: string;
    comment: string;
    likeCount: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};

type SubCommentData = {
    subComment: string;
    writerEmail: string;
};
