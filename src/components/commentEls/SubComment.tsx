import { Cross2Icon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    useContext,
    useEffect,
    useRef,
    useState,
} from "react";
import { getCommentDBRef } from "@/utils/firebase";
import { useMutation, useQueryClient } from "react-query";
import { AuthContext } from "@/store/AuthContext";
import { SubCommentData } from "@/vite-env";
import { v4 as uuidv4 } from "uuid";

const SubComment: React.FC<{
    onOpen: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
    postId: string;
    commentId: string;
}> = (props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const [enteredSubComment, setEnteredSubComment] = useState<string>("");
    const queryClient = useQueryClient();
    const curUser = useContext(AuthContext);

    const updateSubCommentHandler = async (id: string) => {
        const { arrayUnion, updateDoc } = await import("firebase/firestore");
        const docRef = getCommentDBRef(props.postId, props.commentId);
        if (docRef && curUser?.email) {
            await updateDoc(docRef, {
                subComments: arrayUnion({
                    subComment: enteredSubComment,
                    writerEmail: curUser.email,
                    subCommentId: id,
                    createdAt: new Date(),
                }),
            });
        } else {
            console.log("코맨트 참조 디비가 없습니다.");
        }
    };

    const mutation = useMutation(updateSubCommentHandler, {
        onMutate: async (id: string) => {
            const { Timestamp } = await import("firebase/firestore");
            await queryClient.cancelQueries("subComments");
            const previousSubCommets = queryClient.getQueryData("subComments");
            queryClient.setQueriesData<SubCommentData[]>(
                "subComments",
                (old) => [
                    {
                        subComment: enteredSubComment,
                        writerEmail: curUser?.email!,
                        subCommentId: id,
                        createdAt: Timestamp.fromDate(new Date()),
                    },
                    ...(old || []),
                ]
            );
            return { previousSubCommets };
        },
        onError: (error, _, context) => {
            if (context?.previousSubCommets) {
                console.error(error);
                queryClient.setQueriesData(
                    "subComments",
                    context.previousSubCommets
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries("subComments");
        },
    });

    const changeSubCommentHandler = (e: ChangeEvent<HTMLInputElement>) => {
        setEnteredSubComment(e.target.value);
    };

    const onSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const id = uuidv4();
        mutation.mutate(id);
        setEnteredSubComment("");
    };

    const closeHandler = () => {
        props.onOpen(false);
    };

    // 아직 해결 못함
    useEffect(() => {
        if (props.isOpen && inputRef.current !== null) {
            inputRef.current.focus();
        }
    }, [props.isOpen]);

    return (
        <div>
            <form
                className="flex justify-start items-center"
                onSubmit={onSubmitHandler}
            >
                <Cross2Icon
                    className="opacity-60 ml-5 w-3 h-3 focus: cursor-pointer rounded-md hover:bg-stone-300"
                    onClick={closeHandler}
                />
                <Input
                    className="focus-visible:ring-0 focus-visible:ring-offset-0 text-xs p-1 border-0 h-fit w-fit ml-1"
                    placeholder="답글 달기"
                    ref={inputRef}
                    value={enteredSubComment}
                    onChange={changeSubCommentHandler}
                ></Input>
                <button type="submit" />
            </form>
        </div>
    );
};

export default SubComment;
