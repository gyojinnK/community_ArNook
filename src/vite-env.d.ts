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
    postContent: string;
    likeCount: number;
    commentCount: number;
    createdAt: Timestamp;
    updatedAt: Timestamp;
};
