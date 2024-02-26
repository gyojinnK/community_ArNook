import { HeartFilledIcon, HeartIcon } from "@radix-ui/react-icons";
import { Badge } from "../ui/badge";
import { db, getFeedDBRef } from "@/utils/firebase";
import { useContext, useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AuthContext } from "@/store/AuthContext";
import {
    arrayRemove,
    arrayUnion,
    doc,
    getDoc,
    increment,
    updateDoc,
} from "firebase/firestore";

const LikeWrap: React.FC<{
    email: string;
    postId: string;
    likeCount: number;
    flagString: string;
}> = (props) => {
    const curUser = useContext(AuthContext);
    // const [likeCnt, setLikeCnt] = useState<number>(props.likeCount);
    const [likedPosts, setLikedPosts] = useState<string[]>([]);
    const [isliked, setIsLiked] = useState<boolean>(false);
    const queryClient = useQueryClient();

    const fetchLikes = async () => {
        // API 호출 등을 통해 좋아요 수를 가져옵니다.
        const feadRef = getFeedDBRef(props.email + "|" + props.postId);
        const feedData = await getDoc(feadRef);
        const curLikeCount: number = feedData.data()?.likeCount;
        return curLikeCount;
    };

    const { data: likes } = useQuery([props.postId, "likeCnt"], fetchLikes);

    const likeCountHandler = async () => {
        if (!isliked) {
            if (curUser?.email) {
                const userRef = doc(db, "users", curUser.email);
                await updateDoc(userRef, {
                    likedPost: arrayUnion(props.postId),
                });
            }

            const feadRef = getFeedDBRef(props.email + "|" + props.postId);
            await updateDoc(feadRef, {
                likeCount: increment(1),
            });
            // setLikeCnt((prev) => prev + 1);
            setIsLiked(true);
        } else {
            if (curUser?.email) {
                const userRef = doc(db, "users", curUser.email);
                await updateDoc(userRef, {
                    likedPost: arrayRemove(props.postId),
                });
            }
            const feadRef = getFeedDBRef(props.email + "|" + props.postId);
            await updateDoc(feadRef, {
                likeCount: increment(-1),
            });
            // setLikeCnt((prev) => prev - 1);
            setIsLiked(false);
        }
    };

    const mutation = useMutation(likeCountHandler, {
        onMutate: async () => {
            await queryClient.cancelQueries([props.postId, "likeCnt"]);
            const previousLikeCnt = queryClient.getQueryData([
                props.postId,
                "likeCnt",
            ]);
            queryClient.setQueriesData<number>(
                [props.postId, "likeCnt"],
                (old) =>
                    old && isliked ? old + 1 : old && !isliked ? old - 1 : 0
            );
            return { previousLikeCnt };
        },
        onError: (error, _, context) => {
            if (context?.previousLikeCnt) {
                console.error(error);
                queryClient.setQueriesData(
                    [props.postId, "likeCnt"],
                    context.previousLikeCnt
                );
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries([props.postId, "likeCnt"]);
        },
    });

    const fetchLikeData = async () => {
        if (curUser?.email) {
            const docRef = doc(db, "users", curUser.email);
            const likedPostDatas = await getDoc(docRef);
            setLikedPosts(likedPostDatas.data()?.likedPost);
        }
    };

    useEffect(() => {
        fetchLikeData();
    }, []);

    useEffect(() => {
        if (likedPosts && likedPosts.includes(props.postId)) {
            setIsLiked(true);
        }
    }, [likedPosts]);

    return (
        <div className="select-none ">
            {props.flagString === "summary" ? (
                <Badge
                    variant="outline"
                    onClick={() => mutation.mutate()}
                    className="focus: cursor-pointer hover:bg-red-100 rounded-xl px-3 py-1 w-18 h-6"
                >
                    <HeartIcon className="text-red-600 mr-2" />
                    <div className="text-stone-600">{likes}</div>
                </Badge>
            ) : props.flagString === "detail" ? (
                <Badge
                    variant="outline"
                    onClick={() => mutation.mutate()}
                    className="focus: cursor-pointer hover:bg-red-100 rounded-xl px-3 py-1 w-18 h-6"
                >
                    {isliked ? (
                        <HeartFilledIcon className="text-red-600 mx-1 " />
                    ) : (
                        <HeartIcon className="text-red-600 mx-1 " />
                    )}
                </Badge>
            ) : null}
        </div>
    );
};

export default LikeWrap;
