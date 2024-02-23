import { db, storage } from "@/utils/firebase";
import { Card } from "../ui/card";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "../ui/skeleton";
import { Badge } from "../ui/badge";

const UserCard: React.FC<{ imgName: string }> = (props) => {
    const [imgPath, setImgPath] = useState<string>();
    const [nickName, setNickName] = useState<string>("");
    const [followerCnt, setFollowerCnt] = useState<number>(0);
    const [followingCnt, setFollowingCnt] = useState<number>(0);
    // const [feedCnt, setFeedCnt] = useState<number>(0);

    const navigate = useNavigate();

    const fetchUserInfo = async () => {
        const { doc, getDoc } = await import("firebase/firestore");
        const { getDownloadURL, ref } = await import("firebase/storage");
        const dbRef = doc(db, "users", props.imgName);
        const imgRef = ref(storage, `profile/${props.imgName}`);

        getDownloadURL(imgRef).then((path) => {
            setImgPath(path);
        });

        getDoc(dbRef).then((snapshot) => {
            const userInfo = snapshot.data();
            setNickName(userInfo?.nickname);
            setFollowerCnt(userInfo?.follower.length);
            setFollowingCnt(userInfo?.following.length);
        });
    };

    useEffect(() => {
        fetchUserInfo();
    }, []);

    const navigateMyPageHandler = () => {
        navigate("/otherDetail", {
            state: {
                uEmail: props.imgName,
                uNickname: nickName,
                imgPath: imgPath,
            },
        });
    };

    return (
        <Card
            onClick={navigateMyPageHandler}
            className="inline-block w-64 h-80 mx-4 mt-8 rounded-2xl xl:w-80 xl:h-96  bg-stone-100 focus: cursor-pointer hover:bg-stone-200"
        >
            <div className="flex flex-col items-center">
                <Avatar className="w-40 h-40 xl:w-52 xl:h-52 mt-5 mb-3">
                    <AvatarImage src={imgPath} alt="User Profile Image" />
                    <AvatarFallback>
                        <Skeleton className="h-full w-full bg-stone-800" />
                    </AvatarFallback>
                </Avatar>
                <Badge className="bg-stone-600 rounded-lg mt-3 mb-2">
                    <p className="text-lg">{props.imgName}</p>
                </Badge>
                <p className="text-lg text-stone-500">{nickName}</p>
                <div className="flex justify-evenly items-center w-2/3 text-sm text-stone-500 mt-2">
                    <p className="">팔로잉: {followingCnt}</p>
                    <p className="">팔로워: {followerCnt}</p>
                </div>
            </div>
        </Card>
    );
};

export default UserCard;
