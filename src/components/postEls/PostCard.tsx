import { Timestamp } from "firebase/firestore";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { getDBRef, getFeedStorageRef, storage } from "@/utils/firebase";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { useNavigate } from "react-router-dom";
import PostDetailDialog from "./PostDetailDialog";
import LikeWrap from "./LikeWrap";

const PostCard: React.FC<{
    email: string;
    postId: string;
    postTitle: string;
    postHashtags: string[];
    createdAt: Timestamp;
    postContent: string;
    extraLink: string | null;
    isImage: boolean;
    likeCount: number;
}> = (props) => {
    const [imgUrl, setImgUrl] = useState<string>("");
    const [isManage, setIsManage] = useState<boolean>(false);
    const [reload] = useState<boolean>(false);
    const [proFileImgPath, setProFileImgPath] = useState<string>("");
    const [nickName, setNickName] = useState<string>("");
    const navigate = useNavigate();
    const formmatedCreateAt = props.createdAt
        .toDate()
        .toISOString()
        .slice(0, 10);

    useEffect(() => {
        const getUserinfo = async () => {
            const { getDoc } = await import("firebase/firestore");
            const { getDownloadURL, ref } = await import("firebase/storage");
            const dbRef = getDBRef(props.email);
            const imgRef = ref(storage, `profile/${props.email}`);
            const snapshot = await getDoc(dbRef);
            const profileUrl = await getDownloadURL(imgRef);

            setNickName(snapshot.data()?.nickname);
            setProFileImgPath(profileUrl);
        };

        getUserinfo();
    }, [isManage]);

    useEffect(() => {
        const fetchPostImage = async () => {
            if (props.isImage) {
                const { getDownloadURL } = await import("firebase/storage");
                const imgRef = getFeedStorageRef(props.email, props.postId);
                getDownloadURL(imgRef)
                    .then((imgUrl: string) => {
                        setImgUrl(imgUrl);
                    })
                    .catch((error) => {
                        if (
                            error.message.includes("Not Found") ||
                            error.code === "storage/object-not-found"
                        ) {
                        } else {
                            console.error(
                                "이미지를 불러오는 중 에러 발생:",
                                error
                            );
                        }
                    });
            }
        };
        fetchPostImage();
    }, []);

    useEffect(() => {
        setImgUrl("");
    }, [reload]);

    const otherDetailNavigateHandler = async () => {
        navigate("/otherDetail", {
            state: {
                uEmail: props.email,
                uNickname: nickName,
                imgPath: proFileImgPath,
            },
        });
    };

    return (
        <Card className="text-left w-64 lg:w-80 h-96 mx-5 my-5 rounded-3xl inline-block bg-stone-50 overflow-hidden relative">
            <>
                {imgUrl ? (
                    <div
                        className="w-full h-1/3"
                        style={{
                            backgroundImage: `url(${imgUrl})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                        }}
                    ></div>
                ) : null}
                <CardHeader>
                    <PostDetailDialog
                        onNavigate={otherDetailNavigateHandler}
                        email={props.email}
                        postId={props.postId}
                        postTitle={props.postTitle}
                        postHashtags={props.postHashtags}
                        postContent={props.postContent}
                        extraLink={props.extraLink}
                        likeCount={props.likeCount}
                        createdAt={props.createdAt}
                        postImgUrl={imgUrl}
                        profileImgPath={proFileImgPath}
                        isManage={isManage}
                        onSetIsManage={setIsManage}
                    />
                    <CardTitle className="flex justify-between items-center">
                        {props.postTitle}
                    </CardTitle>

                    <CardDescription>
                        <div className="flex justify-start items-center">
                            <div
                                onClick={otherDetailNavigateHandler}
                                className="focus: cursor-pointer hover:underline hover:text-blue-700 w-fit"
                            >
                                {props.email}
                            </div>
                        </div>
                        <div className="mb-2 w-full flex justify-between items-center">
                            {formmatedCreateAt}
                            <LikeWrap
                                email={props.email}
                                postId={props.postId}
                                likeCount={props.likeCount}
                            />
                        </div>
                        <div className="w-full">
                            {props.postHashtags.map((tag, i) => (
                                <Badge
                                    key={i}
                                    variant="outline"
                                    className="text-stone-400 inline-block"
                                >
                                    # {tag}
                                </Badge>
                            ))}
                        </div>
                    </CardDescription>
                </CardHeader>

                <CardContent className="whitespace-pre-wrap">
                    {props.postContent}
                </CardContent>
                <CardFooter>
                    <div className="absolute z-10 left-0 bottom-0 w-full h-10 bg-gradient-to-t from-stone-100 to-transparent"></div>
                </CardFooter>
            </>
        </Card>
    );
};

export default PostCard;
