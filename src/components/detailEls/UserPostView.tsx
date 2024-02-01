import { collection, onSnapshot, query } from "firebase/firestore";
import PostCard from "../postEls/PostCard";
import { db } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import { Post } from "@/vite-env";

const UserPostView: React.FC<{ email: string | null | undefined }> = (
    props
) => {
    // const [isChange, setIsChange] = useState<boolean>(false);
    const [postOwner, setPostOwner] = useState<string>("");
    const [postList, setPostList] = useState<Post[]>([]);

    useEffect(() => {
        console.log(postOwner);
        const q = query(collection(db, "feed"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            let tempArr: Post[] = [];
            querySnapshot.forEach((post) => {
                console.log(post.data());
                const splits = post.data().postId.split("|");
                // setPostOwner();
                if (splits[0] === props.email) {
                    setPostOwner(splits[0]);
                    const tempElement = {
                        postId: splits[1],
                        email: post.data().email,
                        postTitle: post.data().postTitle,
                        postContent: post.data().postContent,
                        likeCount: post.data().likeCount,
                        commentCount: post.data().commentCount,
                        createdAt: post.data().createdAt,
                        updatedAt: post.data().updatedAt,
                    };
                    tempArr.push(tempElement);
                }
            });
            if (tempArr) {
                setPostList(tempArr);
            }
        });
        return () => unsubscribe();
    }, [postOwner]);

    console.log(postList);
    return (
        <div className="w-full text-center">
            {postList.map((postInfo: Post) => (
                <PostCard
                    postTitle={postInfo.postTitle}
                    createdAt={postInfo.createdAt}
                    postContent={postInfo.postContent}
                ></PostCard>
            ))}
        </div>
    );
};

export default UserPostView;
