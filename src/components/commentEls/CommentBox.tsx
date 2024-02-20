import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { db } from "@/utils/firebase";
import { collection, getDocs } from "firebase/firestore";
import { CommentData } from "@/vite-env";
import { useQuery } from "react-query";

const CommentBox: React.FC<{ onOpen: () => void; postId: string }> = (
    props
) => {
    const fetchComnet = async () => {
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
        return tempArr;
    };

    const { data: comments } = useQuery<CommentData[]>("comments", fetchComnet);

    return (
        <div className="text-right">
            <Button
                onClick={props.onOpen}
                variant="outline"
                className="rounded-xl px-3 py-1 w-18 h-6"
            >
                <ChatBubbleIcon className="inline-block mr-2" />
                {comments?.length}
            </Button>
        </div>
    );
};

export default CommentBox;
