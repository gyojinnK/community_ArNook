import UserInfoUpdate from "./UserInfoUpdate";
import { useContext, useState } from "react";
import { UserInfoContext } from "@/store/UserInfoContext";
import { UserProfileContext } from "@/store/UserProfileContext";
import UserAvatar from "./UserAvatar";
import FollowingInfo from "./FollowingInfo";
import FollowerInfo from "./FollowerInfo";
import UserPostView from "./UserPostView";
import { AuthContext } from "@/store/AuthContext";

const UserInfo = () => {
    const curAuthUser = useContext(AuthContext);
    const curUser = useContext(UserInfoContext);
    const curProfile = useContext(UserProfileContext);

    const [curPImageId, setCurPImageId] = useState<string>(
        curProfile?.pImgUrl!
    );

    const changePImgHandler = (changedUrl: string) => {
        setCurPImageId(changedUrl);
    };

    return (
        <>
            <div className="flex relative justify-between items-center flex-col lg:flex-row w-full">
                <div className="flex flex-col lg:flex-row">
                    <UserAvatar curPImageId={curPImageId} />
                    <div className=" mx-5 self-center flex items-start justify-center flex-col">
                        <p className="text-3xl xl:text-6xl">
                            {curUser?.nickName}
                        </p>
                        <p className="text-sm ml-2 mb-5 text-stone-400">
                            {curAuthUser?.email}
                        </p>
                        <div className="flex space-x-2 text-xl xl:text-3xl xl:mb-12 mb-6 text-stone-600">
                            <FollowingInfo />
                            <FollowerInfo />
                        </div>
                        <span className="text-base xl:text-xl">
                            {curUser?.greet}
                        </span>
                    </div>
                </div>
                <UserInfoUpdate onChangePImgHandler={changePImgHandler} />
            </div>
            <hr className="text-popover w-5/6 mx-auto shadow-sm" />
            <UserPostView email={curAuthUser?.email} />
        </>
    );
};

export default UserInfo;
