import PostCard from "../postEls/PostCard";
import { db } from "@/utils/firebase";
import React, { useEffect, useState } from "react";
import { Post } from "@/vite-env";
import { useMediaQuery } from "react-responsive";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";

const UserPostView: React.FC<{ email: string | null | undefined }> = (
    props
) => {
    const [postOwner, setPostOwner] = useState<string>("");
    const [postList, setPostList] = useState<Post[]>([]);

    useEffect(() => {
        const fetchPostList = async () => {
            const { collection, onSnapshot, query } = await import(
                "firebase/firestore"
            );
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
                            isImage: post.data().isImage,
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
        };
        fetchPostList();
    }, [postOwner]);

    const isMobile = useMediaQuery({ query: "(max-width: 780px)" });

    const PostRow = ({ index, style }: ListChildComponentProps) => {
        const postInfo = postList[index];

        return (
            <div style={style}>
                <PostCard
                    key={postInfo?.postId}
                    email={postInfo?.email}
                    postId={postInfo.postId}
                    postTitle={postInfo.postTitle}
                    postHashtags={postInfo.postHashtags}
                    createdAt={postInfo.createdAt}
                    postContent={postInfo.postContent}
                    extraLink={postInfo.extraLink}
                    isImage={postInfo.isImage}
                    likeCount={postInfo.likeCount}
                />
            </div>
        );
    };

    if (isMobile) {
        return (
            <div className="w-full text-center">
                <List
                    height={404 * postList.length}
                    itemCount={postList.length}
                    itemSize={404}
                    width="100%"
                >
                    {PostRow}
                </List>
            </div>
        );
    } else {
        return (
            <div className="w-full text-center">
                {postList.map((postInfo: Post) => (
                    <React.Fragment key={postInfo.postId}>
                        <PostCard
                            email={postInfo.email}
                            postId={postInfo.postId}
                            postTitle={postInfo.postTitle}
                            postHashtags={postInfo.postHashtags}
                            createdAt={postInfo.createdAt}
                            postContent={postInfo.postContent}
                            isImage={postInfo.isImage}
                            extraLink={postInfo.extraLink}
                            likeCount={postInfo.likeCount}
                        />
                    </React.Fragment>
                ))}
            </div>
        );
    }
};

export default UserPostView;
