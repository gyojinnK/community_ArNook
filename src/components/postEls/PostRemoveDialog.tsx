import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
    AlertDialog,
    AlertDialogTrigger,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogAction,
    AlertDialogCancel,
} from "../ui/alert-dialog";
import { Button } from "../ui/button";
import { Timestamp, deleteDoc } from "firebase/firestore";
import { getFeedDBRef, getFeedStorageRef } from "@/firebase/firebase";
import { StorageReference, deleteObject } from "firebase/storage";
import { useNavigate } from "react-router-dom";

const PostRemoveDialog: React.FC<{
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
    email: string;
    postId: string;
    postTitle: string;
    postHashtags: string[];
    postContent: string;
    createdAt: Timestamp;
    postImgUrl: string;
}> = (props) => {
    const removeHandler = async () => {
        // const navigate = useNavigate();
        const docRef = getFeedDBRef(props.email + "|" + props.postId);
        const imgRef: StorageReference | null = getFeedStorageRef(
            props.email,
            props.postId
        );
        try {
            await deleteDoc(docRef);
            if (imgRef) {
                await deleteObject(imgRef).catch(() => {
                    console.log("이미지 참조값이 없어용");
                });
            }
            console.log("게시물 삭제 완료!");
            props.onClose(false);
        } catch (error) {
            console.log("삭제 과정에 문제 발생!!!");
        }
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button variant="destructive">삭제하기</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle className="flex justify-start items-center">
                        <ExclamationTriangleIcon className="w-8 h-8 mr-2" />
                        정말 삭제하시나요?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="m-5">
                        삭제한 게시물은 다시 복구할 수 없습니다.
                        <br />
                        그래도 삭제를 진행하시나요?
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>다시 생각해볼게요.</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={removeHandler}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        네. 지금 삭제할게요.
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
};

export default PostRemoveDialog;
