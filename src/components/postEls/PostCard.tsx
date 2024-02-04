import { Timestamp } from "firebase/firestore";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { getFeedStorageRef } from "@/utils/firebase";
import { getDownloadURL } from "firebase/storage";
import { useContext, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import PostManagement from "./PostManagement";
import { AuthContext } from "@/store/AuthContext";
import { Pencil2Icon } from "@radix-ui/react-icons";

const PostCard: React.FC<{
    email: string;
    postId: string;
    postTitle: string;
    postHashtags: string[];
    createdAt: Timestamp;
    postContent: string;
}> = (props) => {
    const [imgUrl, setImgUrl] = useState<string>("");
    const [isManage, setIsManage] = useState<boolean>(false);
    const [reload, setReload] = useState<boolean>(false);
    const curUser = useContext(AuthContext);
    const formmatedCreateAt = props.createdAt
        .toDate()
        .toISOString()
        .slice(0, 10);

    useEffect(() => {
        const imgRef = getFeedStorageRef(props.email, props.postId);
        // console.log(imgRef.name, " == ", props.postId);
        // console.log(imgRef);
        getDownloadURL(imgRef)
            .then((imgUrl: string) => {
                setImgUrl(imgUrl);
            })
            .catch(() => {
                console.log(
                    "해당 포스트는 이미지가 없습니다!: ",
                    props.postTitle
                );
                setReload((prev) => {
                    return prev ? false : true;
                });
            });
    }, [isManage]);

    useEffect(() => {
        setImgUrl("");
    }, [reload]);

    const managementClickHandler = () => {
        setIsManage(true);
    };

    return (
        <Card className="text-left w-80 h-96 mx-10 my-10 rounded-3xl inline-block bg-stone-50 overflow-hidden relative">
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
                    <CardTitle className="flex justify-between items-center">
                        {props.postTitle}
                        {props.email === curUser?.email ? (
                            <Pencil2Icon
                                onClick={managementClickHandler}
                                className="w-6 h-6"
                            />
                        ) : null}
                    </CardTitle>

                    <CardDescription>
                        <div>{props.email}</div>
                        <div className="mb-2">{formmatedCreateAt}</div>
                        <div className="w-full">
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
                    </CardDescription>
                </CardHeader>
                <CardContent className="">{props.postContent}</CardContent>
                <CardFooter>
                    <div className="absolute z-10 left-0 bottom-0 w-full h-10 bg-gradient-to-t from-stone-100 to-transparent"></div>
                </CardFooter>
            </>
        </Card>
    );
};

export default PostCard;
