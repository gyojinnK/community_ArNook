import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { UserInfo } from "@/vite-env";

export const UserInfoContext = createContext<UserInfo | null>(null);

export const UserInfoProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [userinfo, setUserInfo] = useState<UserInfo | null>(null);
    const curUser = useContext(AuthContext);

    // const unsub = onSnapshot(doc(db, "users", curUser?.email), (doc) => {

    // });

    useEffect(() => {
        const fetchUserInfo = () => {
            if (curUser) {
                const docRef = doc(db, "users", curUser.email);
                const unsub = onSnapshot(docRef, (docSnap) => {
                    if (docSnap.exists()) {
                        console.log(docSnap.data());
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
        };

        fetchUserInfo();
    }, [curUser]);
    return (
        <UserInfoContext.Provider value={userinfo}>
            {children}
        </UserInfoContext.Provider>
    );
};
