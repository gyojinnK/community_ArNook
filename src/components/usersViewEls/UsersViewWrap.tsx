import { StorageReference, listAll, ref } from "firebase/storage";
import UserCard from "./UserCard";
import { storage } from "@/firebase/firebase";
import { useEffect, useState } from "react";

const UsersViewWrap: React.FC = () => {
    const listRef = ref(storage, "profile");
    const [profileList, setProfileList] = useState<StorageReference[]>();

    useEffect(() => {
        listAll(listRef)
            .then((res) => {
                setProfileList(res.items);
            })
            .catch((error) => {
                console.log("ListAll Error!");
            });
    }, []);
    console.log("d오오 출력 좀요..:", profileList);

    return (
        <div className="w-full">
            {profileList?.map((imgRef: StorageReference) => (
                <UserCard key={imgRef.fullPath} imgName={imgRef.name} />
            ))}
        </div>
    );
};

export default UsersViewWrap;
