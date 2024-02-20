import { Timestamp, getDoc, increment, updateDoc } from "firebase/firestore";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import {
    getDBRef,
    getFeedDBRef,
    getFeedStorageRef,
    storage,
} from "@/utils/firebase";
import { getDownloadURL, ref } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import PostManagement from "./PostManagement";
import { AuthContext } from "@/store/AuthContext";
import { HeartIcon, Pencil2Icon } from "@radix-ui/react-icons";
import { useLocation, useNavigate } from "react-router-dom";
import PostDetailDialog from "./PostDetailDialog";
import { FirebaseError } from "firebase/app";

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
    const [likeCnt, setLikeCnt] = useState<number>(props.likeCount);
    const loc = useLocation();
    const curUser = useContext(AuthContext);
    const navigate = useNavigate();
    const formmatedCreateAt = props.createdAt
        .toDate()
        .toISOString()
        .slice(0, 10);

    useEffect(() => {
        const getUserinfo = async () => {
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
        if (props.isImage) {
            const imgRef = getFeedStorageRef(props.email, props.postId);
            getDownloadURL(imgRef)
                .then((imgUrl: string) => {
                    setImgUrl(imgUrl);
                })
                .catch((error: FirebaseError) => {
                    if (
                        error.message.includes("Not Found") ||
                        error.code === "storage/object-not-found"
                    ) {
                    } else {
                        console.error("이미지를 불러오는 중 에러 발생:", error);
                    }
                });
        } else {
        }
    }, []);

    useEffect(() => {
        setImgUrl("");
    }, [reload]);

    const managementClickHandler = () => {
        setIsManage(true);
    };

    const otherDetailNavigateHandler = async () => {
        navigate("/otherDetail", {
            state: {
                uEmail: props.email,
                uNickname: nickName,
                imgPath: proFileImgPath,
            },
        });
    };

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
        <Card className="text-left w-64 lg:w-80 h-96 mx-5 my-5 rounded-3xl inline-block bg-stone-50 overflow-hidden relative">
            <>
                {props.email === curUser?.email && isManage ? (
                    <PostManagement
                        onClose={setIsManage}
                        email={props.email}
                        postId={props.postId}
                        postTitle={props.postTitle}
                        postHashtags={props.postHashtags}
                        postContent={props.postContent}
                        createdAt={props.createdAt}
                        postImgUrl={imgUrl}
                    ></PostManagement>
                ) : null}

                {imgUrl ? <img className="h-1/3 w-full" src={imgUrl} /> : null}

                <CardHeader>
                    <PostDetailDialog
                        onNavigate={otherDetailNavigateHandler}
                        email={props.email}
                        postId={props.postId}
                        postTitle={props.postTitle}
                        postHashtags={props.postHashtags}
                        postContent={props.postContent}
                        extraLink={props.extraLink}
                        createdAt={formmatedCreateAt}
                        postImgUrl={imgUrl}
                        profileImgPath={proFileImgPath}
                    />
                    <CardTitle className="flex justify-between items-center">
                        {props.postTitle}
                        {loc?.pathname !== "/main" &&
                        props.email === curUser?.email ? (
                            <Pencil2Icon
                                onClick={managementClickHandler}
                                className="w-6 h-6 focus: cursor-pointer hover:text-stone-800 text-stone-500"
                            />
                        ) : null}
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
                            <div className="select-none">
                                <Badge
                                    variant="outline"
                                    onClick={increasingLikeCountHandler}
                                    className="focus: cursor-pointer hover:bg-red-100 "
                                >
                                    <HeartIcon className="text-red-600 mr-2" />
                                    <div className="text-stone-600">
                                        {likeCnt}
                                    </div>
                                </Badge>
                            </div>
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
