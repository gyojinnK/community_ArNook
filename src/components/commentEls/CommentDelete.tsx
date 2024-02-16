import { ExclamationTriangleIcon, TrashIcon } from "@radix-ui/react-icons";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "../ui/alert-dialog";
import { getCommentDBRef } from "@/utils/firebase";
import { deleteDoc } from "firebase/firestore";
import { useMutation, useQueryClient } from "react-query";
import { CommentData } from "@/vite-env";

const CommentDelete: React.FC<{ postId: string; commentId: string }> = (
    props
) => {
    const queryClient = useQueryClient();

    const deleteCommentHandler = async (commentId: string) => {
        const docRef = getCommentDBRef(props.postId, commentId);
        await deleteDoc(docRef);
    };

    const deleteComment = useMutation(deleteCommentHandler, {
        onMutate: async (commentId) => {
            await queryClient.cancelQueries("comments");

            const previousComments = queryClient.getQueryData("comments");

            queryClient.setQueryData<CommentData[]>("comments", (old) => {
                return (
                    old?.filter(
                        (comment: CommentData) =>
                            comment.commentId !== commentId
                    ) || []
                );
            });

            return { previousComments };
        },
        onError: (error, _, context) => {
            if (context?.previousComments) {
                console.error(error);
                queryClient.setQueryData("comments", context.previousComments);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries("comments");
        },
    });

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <TrashIcon className="focus: cursor-pointer" />
            </AlertDialogTrigger>
            <AlertDialogContent className="w-5/6">
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex justify-start items-center">
                        <ExclamationTriangleIcon className="w-8 h-8 mr-2" />
                        정말 삭제하시나요?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="m-5">
                        삭제한 댓글은 다시 복구할 수 없습니다.
                        <br />
                        그래도 삭제를 진행하시나요?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>다시 생각해볼게요.</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => deleteComment.mutate(props.commentId)}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        네. 지금 삭제할게요.
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default CommentDelete;
