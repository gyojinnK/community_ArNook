import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Card, CardFooter } from "../ui/card";
import { Link2Icon } from "@radix-ui/react-icons";
import { Separator } from "../ui/separator";
import CommentBox from "../commentEls/CommentBox";
import { useState } from "react";
import CommentWrap from "../commentEls/CommentWrap";

const PostDetailDialog: React.FC<{
    onNavigate: () => void;
    email: string;
    postId: string;
    postTitle: string;
    postHashtags: string[];
    createdAt: string;
    postContent: string;
    extraLink: string | null;
    postImgUrl: string | null;
}> = (props) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    const extraLinkNavigateHandler = () => {
        window.open(`${props.extraLink}`);
    };

    const commentOpenHandler = () => {
        setIsOpen((prev) => {
            return prev ? false : true;
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="inline-block w-fit text-xs text-stone-500 text-left focus: cursor-pointer hover:text-blue-600 hover:underline ">
                    자세히 보기 +
                </div>
            </DialogTrigger>
            <DialogContent className="w-full max-h-full overflow-scroll">
                <DialogHeader>{props.postTitle}</DialogHeader>
                <DialogDescription>
                    <div className="flex justify-start items-center">
                        <div className="mr-2">작성자:</div>
                        <div
                            onClick={props.onNavigate}
                            className="focus: cursor-pointer hover:underline hover:text-blue-700"
                        >
                            {props.email}
                        </div>
                    </div>
                    <div>{props.createdAt}</div>
                </DialogDescription>
                {props.postImgUrl ? (
                    <img src={props.postImgUrl} className="w-full h-full" />
                ) : (
                    <div>이미지가 없는 게시물 입니다.</div>
                )}
                <div className="w-full flex justify-between items-center">
                    <div>
                        {props.postHashtags.map((tag, i) => (
                            <Badge
                                key={i}
                                variant="outline"
                                className="text-stone-400 inline-block "
                            >
                                # {tag}
                            </Badge>
                        ))}
                    </div>
                    <CommentBox
                        onOpen={commentOpenHandler}
                        postId={props.postId}
                    />
                </div>
                {isOpen ? (
                    <CommentWrap email={props.email} postId={props.postId} />
                ) : (
                    <Separator />
                )}

                <div className="whitespace-pre-wrap">{props.postContent}</div>
                <DialogFooter className="w-full">
                    {props.extraLink ? (
                        <Card
                            onClick={extraLinkNavigateHandler}
                            className="mt-5 w-full border-none shadow-none"
                        >
                            <CardFooter className="flex w-full justify-center items-center ">
                                <Card className="w-12 h-10 flex justify-center items-center rounded-r-none bg-stone-100">
                                    <Link2Icon className="w-6 h-6" />
                                </Card>
                                <Card className="w-full h-10 flex justify-start items-center rounded-l-none focus: cursor-pointer hover:bg-stone-200">
                                    <div className="ml-2">
                                        {props.extraLink}
                                    </div>
                                </Card>
                            </CardFooter>
                        </Card>
                    ) : null}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default PostDetailDialog;
