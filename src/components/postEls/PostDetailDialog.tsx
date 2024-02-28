import {
    Dialog,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTrigger,
} from "../ui/dialog";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Link2Icon, Pencil2Icon } from "@radix-ui/react-icons";
import { Separator } from "../ui/separator";
import CommentBox from "../commentEls/CommentBox";
import React, { Suspense, useContext, useState } from "react";
import CommentWrap from "../commentEls/CommentWrap";
import { Avatar, AvatarImage } from "../ui/avatar";
import LikeWrap from "./LikeWrap";
import { AuthContext } from "@/store/AuthContext";
import PostManagement from "./PostManagement";
import { Timestamp } from "firebase/firestore";

const DialogContent = React.lazy(() =>
    import("../ui/dialog").then((module) => ({ default: module.DialogContent }))
);

const PostDetailDialog: React.FC<{
    onNavigate: () => void;
    email: string;
    postId: string;
    postTitle: string;
    postHashtags: string[];
    createdAt: Timestamp;
    postContent: string;
    extraLink: string | null;
    likeCount: number;
    postImgUrl: string;
    profileImgPath: string;
    isManage: boolean;
    onSetIsManage: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
    const [isCommentOpen, setIsCommnetOpen] = useState<boolean>(false);
    const curUser = useContext(AuthContext);
    const formmatedCreateAt = props.createdAt
        .toDate()
        .toISOString()
        .slice(0, 10);

    const extraLinkNavigateHandler = () => {
        window.open(`${props.extraLink}`);
    };

    const commentOpenHandler = () => {
        setIsCommnetOpen((prev) => {
            return prev ? false : true;
        });
    };

    const managementClickHandler = () => {
        props.onSetIsManage(true);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <div className="inline-block absolute top-0 left-0 w-full h-full focus: cursor-pointer hover:bg-stone-400/10"></div>
            </DialogTrigger>
            <Suspense fallback={<div>Loading...</div>}>
                <DialogContent className="w-full max-h-full overflow-scroll">
                    {props.email === curUser?.email && props.isManage ? (
                        <PostManagement
                            onClose={props.onSetIsManage}
                            email={props.email}
                            postId={props.postId}
                            postTitle={props.postTitle}
                            postHashtags={props.postHashtags}
                            postContent={props.postContent}
                            createdAt={props.createdAt}
                            postImgUrl={props.postImgUrl}
                        ></PostManagement>
                    ) : null}
                    <DialogHeader>{props.postTitle}</DialogHeader>
                    <DialogDescription>
                        <div className="flex justify-between items-end">
                            <div
                                className="flex justify-center items-end"
                                onClick={props.onNavigate}
                            >
                                <Avatar className="mr-2 focus: cursor-pointer">
                                    <AvatarImage
                                        src={props.profileImgPath}
                                        alt="Writer Profile Image"
                                    />
                                </Avatar>
                                <div className="focus: cursor-pointer hover:underline hover:text-blue-700">
                                    {props.email}
                                </div>
                            </div>
                            <div className="flex flex-col">
                                {props.email === curUser?.email ? (
                                    <Pencil2Icon
                                        onClick={managementClickHandler}
                                        className="w-6 h-6 mb-2 focus: cursor-pointer hover:text-stone-800 text-stone-500 self-end"
                                    />
                                ) : null}
                                <div>{formmatedCreateAt}</div>
                            </div>
                        </div>
                    </DialogDescription>
                    {props.postImgUrl ? (
                        <img
                            src={props.postImgUrl}
                            alt="Post Image"
                            className="w-full h-full"
                        />
                    ) : (
                        <div className="text-black/30 text-sm text-center">
                            이미지가 없는 게시물 입니다.
                        </div>
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
                        <div className="flex self-end">
                            <LikeWrap
                                email={props.email}
                                postId={props.postId}
                                likeCount={props.likeCount}
                                flagString={"detail"}
                            />
                            <CommentBox
                                onOpen={commentOpenHandler}
                                postId={props.postId}
                            />
                        </div>
                    </div>
                    {isCommentOpen ? (
                        <CommentWrap
                            email={props.email}
                            postId={props.postId}
                            profileImgPath={props.profileImgPath}
                        />
                    ) : (
                        <Separator />
                    )}

                    <div className="whitespace-pre-wrap">
                        {props.postContent}
                    </div>
                    <DialogFooter className="w-full">
                        {props.extraLink ? (
                            <>
                                <Card className="mt-5 w-full border-none shadow-none">
                                    <Separator />
                                    <CardHeader className="p-0">
                                        <CardTitle className="text-stone-500 p-2 text-lg">
                                            Link
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent
                                        className="flex w-full justify-center items-center p-0"
                                        onClick={extraLinkNavigateHandler}
                                    >
                                        <Card className="w-12 h-10 flex justify-center items-center rounded-r-none bg-stone-100 focus: cursor-pointer">
                                            <Link2Icon className="w-6 h-6" />
                                        </Card>
                                        <Card className="w-full h-10 flex justify-start items-center rounded-l-none focus: cursor-pointer hover:bg-stone-200">
                                            <div className="ml-2">
                                                {props.extraLink}
                                            </div>
                                        </Card>
                                    </CardContent>
                                </Card>
                            </>
                        ) : null}
                    </DialogFooter>
                </DialogContent>
            </Suspense>
        </Dialog>
    );
};

export default PostDetailDialog;
