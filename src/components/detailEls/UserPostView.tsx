import { collection, onSnapshot, query } from "firebase/firestore";
import PostCard from "../postEls/PostCard";
import { db } from "@/utils/firebase";
import { useEffect, useState } from "react";
import { Post } from "@/vite-env";

const UserPostView: React.FC<{ email: string | null | undefined }> = (
    props
) => {
    const [postOwner, setPostOwner] = useState<string>("");
    const [postList, setPostList] = useState<Post[]>([]);

    useEffect(() => {
        console.log(postOwner);
        const q = query(collection(db, "feed"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let tempArr: Post[] = [];
            querySnapshot.forEach((post) => {
                const splits = post.data().postId.split("|");
                if (splits[0] === props.email) {
                    setPostOwner(splits[0]);
                    const tempElement = {
                        postId: splits[1],
                        email: post.data().email,
                        postTitle: post.data().postTitle,
                        postHashtags: post.data().postHashtags,
                        postContent: post.data().postContent,
                        extraLink: post.data().extraLink,
                        likeCount: post.data().likeCount,
                        commentCount: post.data().commentCount,
                        createdAt: post.data().createdAt,
                        updatedAt: post.data().updatedAt,
                    };
                    tempArr.push(tempElement);
                }
            });
            if (tempArr) {
                tempArr.sort(
                    (a: Post, b: Post) =>
                        b.createdAt.toDate().getTime() -
                        a.createdAt.toDate().getTime()
                );
                setPostList(tempArr);
            }
        });
        return () => unsubscribe();
    }, [postOwner]);

    return (
        <div className="w-full text-center">
            {postList.map((postInfo: Post) => (
                <PostCard
                    key={postInfo.postId}
                    email={postInfo.email}
                    postId={postInfo.postId}
                    postTitle={postInfo.postTitle}
                    postHashtags={postInfo.postHashtags}
                    createdAt={postInfo.createdAt}
                    postContent={postInfo.postContent}
                    extraLink={postInfo.extraLink}
                    likeCount={postInfo.likeCount}
                ></PostCard>
            ))}
        </div>
    );
};

export default UserPostView;
