import { SubCommentData } from "@/vite-env";
import SubCommentDelete from "./SubCommentDelete";

const SubCommentElement: React.FC<{
    subCom: SubCommentData;
    postId: string;
    commentId: string;
    commentOwner: string;
}> = (props) => {
    return (
        <div className="my-2 flex justify-between items-center">
            <div>
                <div className=" text-xs text-stone-400">
                    {props.subCom.writerEmail}
                </div>
                <div className=" text-sm">{props.subCom.subComment}</div>
            </div>
            <SubCommentDelete
                subCom={props.subCom}
                postId={props.postId}
                commentId={props.commentId}
                commentOwner={props.commentOwner}
            />
        </div>
    );
};

export default SubCommentElement;
