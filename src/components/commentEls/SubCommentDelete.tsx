import { db } from "@/utils/firebase";
import { SubCommentData } from "@/vite-env";
import { TrashIcon } from "@radix-ui/react-icons";
import { arrayRemove, doc, updateDoc } from "firebase/firestore";
import { useMutation, useQuery, useQueryClient } from "react-query";

const SubCommentDelete: React.FC<{
    subCom: SubCommentData;
    postId: string;
    commentId: string;
}> = (props) => {
    const queryClient = useQueryClient();

    const deleteSubComHandler = async () => {
        const subCommentRef = props.postId + "|" + props.commentId;
        const docRef = doc(db, "comment", subCommentRef);
        try {
            if (docRef) {
                await updateDoc(docRef, {
                    subComments: arrayRemove({
                        subComment: props.subCom.subComment,
                        writerEmail: props.subCom.writerEmail,
                        subCommentId: props.subCom.subCommentId,
                    }),
                });
                console.log("삭제를 완료했습니다!");
            }
        } catch (err) {
            console.log("해당 데이터가 없거나 삭제에 문제가 발생했습니다!");
        }
    };

    const deleteSubComment = useMutation(deleteSubComHandler, {
        onMutate: async (subCommentId: string) => {
            await queryClient.cancelQueries("subComments");
            const previousSubComments = queryClient.getQueryData("subComments");
            queryClient.setQueryData<SubCommentData[]>("subComments", (old) => {
                return (
                    old?.filter(
                        (subComment: SubCommentData) =>
                            subComment.subCommentId !== subCommentId
                    ) || []
                );
            });
            return { previousSubComments };
        },
        onError: (error, variables, context) => {
            if (context?.previousSubComments) {
                queryClient.setQueryData(
                    "subComments",
                    context.previousSubComments
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries("subComments");
        },
    });

    return (
        <TrashIcon
            onClick={() => deleteSubComment.mutate(props.subCom.subCommentId)}
            className="focus: cursor-pointer"
        />
    );
};

export default SubCommentDelete;
