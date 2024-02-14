import { CommentData } from "@/vite-env";
import CommentDelete from "./CommentDelete";
import { useContext, useState } from "react";
import { AuthContext } from "@/store/AuthContext";
import { Badge } from "../ui/badge";
import { HeartIcon, PlusIcon } from "@radix-ui/react-icons";
import { useMutation, useQueryClient } from "react-query";
import { getCommentDBRef } from "@/utils/firebase";
import { getDoc, increment, updateDoc } from "firebase/firestore";
import SubComment from "./SubComment";
import SubCommentList from "./SubCommentList";

const CommentElement: React.FC<{
    commentInfo: CommentData;
    email: string;
    postId: string;
}> = (props) => {
    const curUser = useContext(AuthContext);

    const [likeCnt, setLikeCnt] = useState<number>(props.commentInfo.likeCount);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const subCommentOpenHandler = () => {
        setIsOpen((prev) => {
            return prev ? false : true;
        });
    };

    const increasingLikeCountHandler = async () => {
        const commentRef = getCommentDBRef(
            props.postId,
            props.commentInfo.commentId
        );
        await updateDoc(commentRef, {
            likeCount: increment(1),
        });

        const snapshot = await getDoc(commentRef);

        return snapshot.data()?.likeCount;
    };

    const increasingLikeCount = useMutation(increasingLikeCountHandler, {
        onMutate: async () => {
            await queryClient.cancelQueries("likeCnts");
            const previousLikeCnt =
                queryClient.getQueryData<number>("likeCnts");
            setLikeCnt(likeCnt + 1);
            return { previousLikeCnt };
        },
        onError: (error, variables, context) => {
            if (context?.previousLikeCnt) {
                setLikeCnt(context.previousLikeCnt);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries("likeCnts");
        },
    });

    return (
        <>
            <div
                key={props.commentInfo.commentId}
                className="flex justify-between items-center"
            >
                <div>
                    <div className="text-sm text-stone-400 focus: cursor-pointer">
                        {props.commentInfo.writerEmail}
                    </div>
                    <div>{props.commentInfo.comment}</div>
                </div>
                <div className="flex justify-end items-center">
                    {props.commentInfo.writerEmail === curUser?.email ||
                    props.email === curUser?.email ? (
                        <div className="flex justify-center items-center mr-2">
                            <CommentDelete
                                postId={props.postId}
                                commentId={props.commentInfo.commentId}
                            />
                        </div>
                    ) : null}
                    <Badge
                        variant="outline"
                        onClick={() => increasingLikeCount.mutate()}
                        className="focus: cursor-pointer hover:bg-red-100"
                    >
                        <HeartIcon className="text-red-600 mr-2" />
                        <div className="text-stone-600">{likeCnt}</div>
                    </Badge>
                </div>
            </div>
            <SubCommentList
                postId={props.commentInfo.postId}
                commentId={props.commentInfo.commentId}
                commentOwner={props.email}
            />
            <div className="mb-8 ">
                {isOpen ? (
                    <SubComment
                        onOpen={setIsOpen}
                        isOpen={isOpen}
                        postId={props.commentInfo.postId}
                        commentId={props.commentInfo.commentId}
                    />
                ) : (
                    <div
                        className="flex justify-start items-center"
                        onClick={subCommentOpenHandler}
                    >
                        <PlusIcon className="w-3 h-3 ml-5 focus: cursor-pointer rounded-md hover:bg-stone-300 opacity-40" />
                        <div className="text-xs text-stone-400 focus: cursor-pointer p-1 ml-1 w-fit ">
                            답글 달기
                        </div>
                    </div>
                )}
            </div>
        </>
    );
};

export default CommentElement;
