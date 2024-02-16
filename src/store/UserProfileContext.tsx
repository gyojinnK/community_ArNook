import { createContext, useContext, useEffect, useState } from "react";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/utils/firebase";
import { UserInfoContext } from "./UserInfoContext";
import { AuthContext } from "./AuthContext";
import { v4 as uuidv4 } from "uuid";

type ProfileInfo = {
    pImgUrl: string;
    pImgId: string;
};

export const UserProfileContext = createContext<ProfileInfo | null>(null);

export const UserProfileProvier = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [profileUrl, setProfileUrl] = useState<ProfileInfo | null>(null);
    const curUser = useContext(UserInfoContext);
    const curAuthUser = useContext(AuthContext);

    const imgRef = ref(storage, `profile/${curAuthUser?.email}`);

    useEffect(() => {
        const fetchProfile = async () => {
            if (curUser) {
                const curUserProfile = await getDownloadURL(imgRef);
                if (curUserProfile) {
                    setProfileUrl({
                        pImgUrl: curUserProfile,
                        pImgId: uuidv4(),
                    });
                } else {
                    console.log("Profile Context Error!");
                }
            }
        };
        fetchProfile();
    }, [curUser]);

    return (
        <UserProfileContext.Provider value={profileUrl}>
            {children}
        </UserProfileContext.Provider>
    );
};
