import UserInfoUpdate from "./UserInfoUpdate";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserInfoContext } from "@/store/UserInfoContext";
import UserAvatar from "./UserAvatar";
import { UserProfileContext } from "@/store/UserProfileContext";

const UserInfo = () => {
    const curUser = useContext(UserInfoContext);
    const curProfile = useContext(UserProfileContext);

    const [curPImageId, setCurPImageId] = useState<string | undefined>(
        curProfile?.pImgUrl
    );

    const changePImgHandler = (changedUrl: string) => {
        setCurPImageId(changedUrl);
    };

    return (
        <div className="w-screen h-96 flex items-center">
            <UserAvatar curPImageId={curPImageId} />
            <div className="h-64 self-center flex items-start justify-center flex-col">
                <p className="text-6xl mb-5">{curUser?.nickName}</p>
                <div className="flex space-x-10 text-3xl mb-12 text-stone-600">
                    <p>팔로워: {"1234"}</p>
                    <p>팔로잉: {"1234"}</p>
                </div>
                <span className="text-xl">{curUser?.greet}</span>
            </div>
            <UserInfoUpdate onChangePImgHandler={changePImgHandler} />
        </div>
    );
};

export default UserInfo;
