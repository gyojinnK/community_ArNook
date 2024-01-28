import { Url } from "url";
import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getDownloadURL, ref } from "firebase/storage";
import { storage } from "@/firebase/firebase";

export const UserProfileContext = createContext<string | null>(null);

export const UserProfileProvier = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [profileUrl, setProfileUrl] = useState<string | null>(null);
    const curUser = useContext(AuthContext);

    useEffect(() => {
        const fetchProfile = async () => {
            if (curUser) {
                const imgRef = ref(storage, `profile/${curUser?.email}`);
                const curUserProfile = await getDownloadURL(imgRef);
                if (curUserProfile) {
                    setProfileUrl(curUserProfile);
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
