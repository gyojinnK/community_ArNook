import { useLocation } from "react-router-dom";
import React, { Suspense, useEffect, useState } from "react";
import { getDBRef } from "@/firebase/firebase";
import { onSnapshot } from "firebase/firestore";
import FollowerBox from "@/components/followEls/FollowerBox";
import { Button } from "../ui/button";
import UserPostView from "../detailEls/UserPostView";

const UserAvatar = React.lazy(() => import("../detailEls/UserAvatar"));

const OtherUserInfo: React.FC = () => {
    const [greet, setGreet] = useState<string>("");
    const [followerCount, setFollowerCount] = useState<number>(0);
    const [followingCount, setFollowingCount] = useState<number>(0);
    const loc = useLocation();
    const dbRef = getDBRef(loc?.state.uEmail);

    useEffect(() => {
        const fetchData = async () => {
            onSnapshot(dbRef!, (snapshot) => {
                setGreet(snapshot.data()?.greet);
                setFollowerCount(snapshot.data()?.follower.length);
                setFollowingCount(snapshot.data()?.following.length);
            });
        };
        fetchData();
    }, []);

    return (
        <>
            <div className="flex relative justify-between items-center flex-col lg:flex-row w-full">
                <div className="flex flex-col lg:flex-row">
                    <Suspense fallback={<div>Loading...</div>}>
                        <UserAvatar curPImageId={loc?.state.imgPath} />
                    </Suspense>
                    <div className="mx-5 self-center flex items-start justify-center flex-col">
                        <p className="text-3xl xl:text-6xl">
                            {loc?.state.uNickname}
                        </p>
                        <div className="text-sm ml-2 mb-5 text-stone-400">
                            {loc?.state.uEmail}
                        </div>
                        <div className="flex space-x-2 text-xl xl:text-3xl xl:mb-12 mb-6 text-stone-600">
                            <Button className="bg-white text-stone-600 border border-stone-600 hover:bg-white focus: cursor-default">
                                팔로잉 {followingCount}
                            </Button>
                            <Button className="bg-white text-stone-600 border border-stone-600 hover:bg-white focus: cursor-default">
                                팔로워 {followerCount}
                            </Button>
                        </div>
                        <span className="text-base xl:text-xl">{greet}</span>
                    </div>
                </div>
                <FollowerBox
                    otherUserEmail={loc?.state.uEmail}
                    otherUserNickname={loc?.state.uNickname}
                />
            </div>
            <hr className="text-popover w-5/6 mx-auto shadow-sm" />
            <UserPostView email={loc?.state.uEmail} />
        </>
    );
};

export default OtherUserInfo;
