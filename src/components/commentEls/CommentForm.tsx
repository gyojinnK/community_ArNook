import { RefObject, useContext, useState } from "react";
import { Input } from "../ui/input";
import { AuthContext } from "@/store/AuthContext";
import { getCommentDBRef } from "@/utils/firebase";
import { Timestamp, setDoc } from "firebase/firestore";
import { Button } from "../ui/button";
import { v4 as uuidv4 } from "uuid";
import { useMutation, useQueryClient } from "react-query";
import { CommentData } from "@/vite-env";

const CommentForm: React.FC<{
    email: string;
    postId: string;
    scrollRef: RefObject<HTMLDivElement>;
}> = (props) => {
    const [enteredComment, setEnteredComment] = useState<string>("");
    const curUser = useContext(AuthContext);

    const queryClient = useQueryClient();
    const mutation = useMutation(
        async (uniqueId: string) => {
            if (curUser && curUser.email) {
                const docRef = getCommentDBRef(props.postId, uniqueId);
                await setDoc(docRef, {
                    writerEmail: curUser.email!,
                    postId: props.postId,
                    commentId: uniqueId,
                    comment: enteredComment,
                    likeCount: 0,
                    subComments: [],
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });
            }
        },
        {
            onMutate: async (uniqueId: string) => {
                await queryClient.cancelQueries("comments");
                const previousComments = queryClient.getQueryData("comments");
                queryClient.setQueriesData<CommentData[]>("comments", (old) => [
                    {
                        writerEmail: curUser?.email!,
                        postId: props.postId,
                        commentId: uniqueId,
                        comment: enteredComment,
                        likeCount: 0,
                        subComments: [],
                        createdAt: Timestamp.fromDate(new Date()),
                        updatedAt: Timestamp.fromDate(new Date()),
                    },
                    ...(old || []),
                ]);
                return { previousComments };
            },
            onError: (error, variables, context) => {
                if (context?.previousComments) {
                    queryClient.setQueriesData(
                        "comments",
                        context.previousComments
                    );
                }
            },
            onSuccess: () => {
                queryClient.invalidateQueries("comments");
            },
        }
    );

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const uniqueId: string = uuidv4();
        mutation.mutate(uniqueId);
        setEnteredComment("");
        props.scrollRef.current!.scrollIntoView({ behavior: "smooth" });
    };

    const onChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
        setEnteredComment(e.currentTarget.value);
    };

    return (
        <form
            onSubmit={onSubmit}
            className="w-full flex justify-center items-center"
        >
            <Input
                id="inputCom"
                type="text"
                className="focus-visible:ring-0 focus:border-0 rounded-r-none border-stone-300 box-border"
                placeholder="댓글을 작성해주세요."
                value={enteredComment}
                onChange={onChangeHandler}
            />
            <Button type="submit" className="rounded-l-none">
                확인
            </Button>
        </form>
    );
};

export default CommentForm;
