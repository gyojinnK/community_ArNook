import { db, storage } from "@/firebase/firebase";
import { Card } from "../ui/card";
import { getDownloadURL, ref } from "firebase/storage";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { doc, getDoc } from "firebase/firestore";

const UserCard: React.FC<{ imgName: string }> = (props) => {
    const [imgPath, setImgPath] = useState<string>();
    const [nickName, setNickName] = useState<string>("");
    const imgRef = ref(storage, `profile/${props.imgName}`);
    const dbRef = doc(db, "users", props.imgName);

    useEffect(() => {
        getDownloadURL(imgRef).then((path) => {
            setImgPath(path);
        });

        getDoc(dbRef).then((snapshot) => {
            const userInfo = snapshot.data();
            setNickName(userInfo?.nickname);
        });
    }, []);

    return (
        <Card className="inline-block w-64 h-80 mx-4 mt-8 rounded-2xl xl:w-80 xl:h-96  bg-stone-100">
            <div className="flex flex-col items-center">
                <Avatar className="w-40 h-40 xl:w-48 xl:h-48 mt-5 mb-3">
                    <AvatarImage src={imgPath} />
                    <AvatarFallback>{imgPath}</AvatarFallback>
                </Avatar>
                <p className="text-lg">{nickName}</p>
            </div>
        </Card>
    );
};

export default UserCard;
