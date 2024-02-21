import { HeartIcon } from "@radix-ui/react-icons";
import { Badge } from "../ui/badge";
import { getFeedDBRef } from "@/utils/firebase";
import { increment, updateDoc } from "firebase/firestore";
import { useState } from "react";
import { useMutation, useQueryClient } from "react-query";

const LikeWrap: React.FC<{
    email: string;
    postId: string;
    likeCount: number;
}> = (props) => {
    const [likeCnt, setLikeCnt] = useState<number>(props.likeCount);
    const queryClient = useQueryClient();

    const increasingLikeCountHandler = async () => {
        const feadRef = getFeedDBRef(props.email + "|" + props.postId);
        await updateDoc(feadRef, {
            likeCount: increment(1),
        });
        setLikeCnt((prev) => prev + 1);
    };

    const mutation = useMutation(increasingLikeCountHandler, {
        onMutate: async () => {
            await queryClient.cancelQueries("likeCnt");
            const previousLikeCnt = queryClient.getQueryData("likeCnt");
            queryClient.setQueriesData<number>("likeCnt", (old) =>
                old ? old + 1 : 1
            );
            return { previousLikeCnt };
        },
        onError: (error, _, context) => {
            if (context?.previousLikeCnt) {
                console.error(error);
                queryClient.setQueriesData("likeCnt", context.previousLikeCnt);
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries("likeCnt");
        },
    });

    return (
        <div className="select-none ">
            <Badge
                variant="outline"
                onClick={() => mutation.mutate()}
                className="focus: cursor-pointer hover:bg-red-100 rounded-xl px-3 py-1 w-18 h-6"
            >
                <HeartIcon className="text-red-600 mr-2" />
                <div className="text-stone-600">{likeCnt}</div>
            </Badge>
        </div>
    );
};

export default LikeWrap;
