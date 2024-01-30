import { db, storage } from "@/firebase/firebase";
import { Card } from "../ui/card";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { doc, getDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const UserCard: React.FC<{ imgName: string }> = (props) => {
    const [imgPath, setImgPath] = useState<string>();
    const [nickName, setNickName] = useState<string>("");
    const imgRef = ref(storage, `profile/${props.imgName}`);
    const dbRef = doc(db, "users", props.imgName);
    const navigate = useNavigate();

    useEffect(() => {
        getDownloadURL(imgRef).then((path) => {
            setImgPath(path);
        });

        getDoc(dbRef).then((snapshot) => {
            const userInfo = snapshot.data();
            setNickName(userInfo?.nickname);
        });
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
                <Avatar className="w-40 h-40 xl:w-48 xl:h-48 mt-5 mb-3">
                    <AvatarImage src={imgPath} />
                    <AvatarFallback>{imgPath}</AvatarFallback>
                </Avatar>
                <p className="text-lg">{nickName}</p>
                <p className="text-lg">{props.imgName}</p>
            </div>
        </Card>
    );
};

export default UserCard;
