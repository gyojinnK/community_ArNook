import { Cross1Icon } from "@radix-ui/react-icons";
import PostUpdateDialog from "./PostUpdateDialog";
import { Timestamp } from "firebase/firestore";
import PostRemoveDialog from "./PostRemoveDialog";

const PostManagement: React.FC<{
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    email: string;
    postId: string;
    postTitle: string;
    postHashtags: string[];
    postContent: string;
    createdAt: Timestamp;
    postImgUrl: string;
}> = (props) => {
    const closeHandler = () => {
        props.onClose(false);
    };
    return (
        <div className="w-full h-full bg-black/80 absolute top-0 left-0 z-30 flex justify-center items-center">
            <Cross1Icon
                onClick={closeHandler}
                className="absolute top-5 right-5 text-white"
            />
            <PostUpdateDialog
                email={props.email}
                postId={props.postId}
                postTitle={props.postTitle}
                postHashtags={props.postHashtags}
                postContent={props.postContent}
                createdAt={props.createdAt}
                postImgUrl={props.postImgUrl}
                onClose={props.onClose}
            />
            <PostRemoveDialog
                onClose={props.onClose}
                email={props.email}
                postId={props.postId}
                postTitle={props.postTitle}
                postHashtags={props.postHashtags}
                postContent={props.postContent}
                createdAt={props.createdAt}
                postImgUrl={props.postImgUrl}
            />
        </div>
    );
};

export default PostManagement;
