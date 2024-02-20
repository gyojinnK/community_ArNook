import { HeartIcon } from "@radix-ui/react-icons";
import { Badge } from "../ui/badge";
import { getFeedDBRef } from "@/utils/firebase";
import { getDoc, increment, updateDoc } from "firebase/firestore";
import { useState } from "react";

const LikeWrap: React.FC<{
    email: string;
    postId: string;
    likeCount: number;
}> = (props) => {
    const [likeCnt, setLikeCnt] = useState<number>(props.likeCount);

    const increasingLikeCountHandler = async () => {
        const feadRef = getFeedDBRef(props.email + "|" + props.postId);
        await updateDoc(feadRef, {
            likeCount: increment(1),
        });

        const snapshot = await getDoc(feadRef);
        if (snapshot) {
            setLikeCnt(snapshot.data()?.likeCount);
        }
    };

    return (
        <div className="select-none ">
            <Badge
                variant="outline"
                onClick={increasingLikeCountHandler}
                className="focus: cursor-pointer hover:bg-red-100 rounded-xl px-3 py-1 w-18 h-6"
            >
                <HeartIcon className="text-red-600 mr-2" />
                <div className="text-stone-600">{likeCnt}</div>
            </Badge>
        </div>
    );
};

export default LikeWrap;
