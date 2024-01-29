import { useLocation } from "react-router-dom";
import React, { Suspense, useEffect, useState } from "react";
import { db } from "@/firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const UserAvatar = React.lazy(() => import("../detailEls/UserAvatar"));

const OtherUserInfo: React.FC = () => {
    const [greet, setGreet] = useState<string>("");
    const loc = useLocation();
    const dbRef = doc(db, "users", loc?.state.uEmail);

    useEffect(() => {
        const fetchData = async () => {
            const snapshot = await getDoc(dbRef);
            setGreet(snapshot.data()?.greet);
        };
        fetchData();
    }, []);

    return (
        <div className="flex relative justify-between items-center flex-col lg:flex-row w-full">
            <div className="flex flex-col lg:flex-row">
                <Suspense fallback={<div>Loading...</div>}>
                    <UserAvatar curPImageId={loc?.state.imgPath} />
                </Suspense>
                <div className="mx-5 self-center flex items-start justify-center flex-col">
                    <p className="text-3xl mb-5 xl:text-6xl">
                        {loc?.state.uNickname}
                    </p>
                    <div className="flex space-x-10 text-xl xl:text-3xl xl:mb-12 mb-6 text-stone-600">
                        <p>팔로워: {"1234"}</p>
                        <p>팔로잉: {"1234"}</p>
                    </div>
                    <span className="text-base xl:text-xl">{greet}</span>
                </div>
            </div>
        </div>
    );
};

export default OtherUserInfo;
