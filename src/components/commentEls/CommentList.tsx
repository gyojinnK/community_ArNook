import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { CommentData } from "@/vite-env";
import { useQuery } from "react-query";
import { useRef } from "react";
import CommentElement from "./CommentElement";

const CommentList: React.FC<{ email: string; postId: string }> = (props) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    const fetchAllComment = async () => {
        const querySnapshot = await getDocs(collection(db, "comment"));
        let tempArr: CommentData[] = [];
        querySnapshot.forEach((doc) => {
            if (doc.data() && doc.data().postId === props.postId) {
                const tempObj: CommentData = {
                    writerEmail: doc.data().writerEmail,
                    postId: doc.data().postId,
                    commentId: doc.data().commentId,
                    comment: doc.data().comment,
                    likeCount: doc.data().likeCount,
                    createdAt: doc.data().createdAt,
                    updatedAt: doc.data().updatedAt,
                };
                tempArr.push(tempObj);
            }
        });
        if (tempArr) {
            tempArr.sort(
                (a: CommentData, b: CommentData) =>
                    b.createdAt.toDate().getTime() -
                    a.createdAt.toDate().getTime()
            );
        }
        scrollRef.current!.scrollIntoView({ behavior: "smooth" });
        return tempArr;
    };

    const { data: comments } = useQuery<CommentData[]>(
        "comments",
        fetchAllComment
    );

    return (
        <div className="max-h-44 overflow-scroll">
            <div ref={scrollRef}></div>
            {comments ? (
                comments.map((commentInfo) => (
                    <CommentElement
                        key={commentInfo.commentId}
                        commentInfo={commentInfo}
                        email={props.email}
                        postId={props.postId}
                    />
                ))
            ) : (
                <div>댓글이 없습니다.</div>
            )}
        </div>
    );
};

export default CommentList;
