import { CommentData } from "@/vite-env";
import CommentDelete from "./CommentDelete";
import { useContext } from "react";
import { AuthContext } from "@/store/AuthContext";
import { getCommentDBRef } from "@/utils/firebase";
import { deleteDoc } from "firebase/firestore";

const CommentElement: React.FC<{
    commentInfo: CommentData;
    email: string;
    postId: string;
}> = (props) => {
    const curUser = useContext(AuthContext);

    return (
        <div
            key={props.commentInfo.commentId}
            className="mb-8 flex justify-between items-center"
        >
            <div>
                <div className="text-sm text-stone-600">
                    {props.commentInfo.writerEmail}
                </div>
                <div>{props.commentInfo.comment}</div>
            </div>
            {props.commentInfo.writerEmail === curUser?.email ||
            props.email === curUser?.email ? (
                <div className="flex justify-center items-center">
                    <CommentDelete
                        postId={props.postId}
                        commentId={props.commentInfo.commentId}
                    />
                </div>
            ) : null}
        </div>
    );
};

export default CommentElement;
