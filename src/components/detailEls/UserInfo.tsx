import UserInfoUpdate from "./UserInfoUpdate";
import { useContext, useState } from "react";
import { UserInfoContext } from "@/store/UserInfoContext";
import { UserProfileContext } from "@/store/UserProfileContext";
import UserAvatar from "./UserAvatar";

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
        <>
            <div className="flex relative justify-between items-center flex-col lg:flex-row w-full">
                <div className="flex flex-col lg:flex-row">
                    <UserAvatar curPImageId={curPImageId} />
                    <div className=" mx-5 self-center flex items-start justify-center flex-col">
                        <p className="text-3xl mb-5 xl:text-6xl">
                            {curUser?.nickName}
                        </p>
                        <div className="flex space-x-10 text-xl xl:text-3xl xl:mb-12 mb-6 text-stone-600">
                            <p>팔로워: {"1234"}</p>
                            <p>팔로잉: {"1234"}</p>
                        </div>
                        <span className="text-base xl:text-xl">
                            {curUser?.greet}
                        </span>
                    </div>
                </div>
                <UserInfoUpdate onChangePImgHandler={changePImgHandler} />
            </div>
            <hr className="text-popover w-5/6 mx-auto shadow-sm" />
        </>
    );
};

export default UserInfo;
