import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { getDBRef } from "@/utils/firebase";
import { UserInfo } from "@/vite-env";

export const UserInfoContext = createContext<UserInfo | null>(null);

export const UserInfoProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [userinfo, setUserInfo] = useState<UserInfo | null>(null);
    const curUser = useContext(AuthContext);

    useEffect(() => {
        const fetchUserInfo = async () => {
            if (curUser) {
                const docRef = getDBRef(curUser.email!);
                if (docRef) {
                    const { onSnapshot } = await import("firebase/firestore");
                    onSnapshot(docRef, (docSnap) => {
                        if (docSnap.exists()) {
                            setUserInfo({
                                nickName: docSnap.data().nickname,
                                password: docSnap.data().password,
                                profileImage: docSnap.data().profileImage,
                                greet: docSnap.data().greet,
                            });
                        } else {
                            console.log("No such document!");
                        }
                    });
                }
            }
        };

        fetchUserInfo();
    }, [curUser]);
    return (
        <UserInfoContext.Provider value={userinfo}>
            {children}
        </UserInfoContext.Provider>
    );
};
