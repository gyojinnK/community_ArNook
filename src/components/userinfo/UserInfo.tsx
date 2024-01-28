import { Avatar, AvatarImage } from "../ui/avatar";
import demoImg from "@/assets/image/ArNook_symbol.png";

import UserInfoUpdate from "./UserInfoUpdate";
import { useContext } from "react";
import { UserInfoContext } from "@/store/userInfoContext";
import { UserProfileContext } from "@/store/UserProfileContext";

const UserInfo = () => {
    const curUser = useContext(UserInfoContext);
    const curProfile = useContext(UserProfileContext);

    return (
        <div className="w-screen h-96 flex items-center">
            <Avatar className="w-72 h-72 ml-24 mr-16">
                <AvatarImage src={curProfile ? curProfile : demoImg} />
            </Avatar>
            <div className="h-64 self-center flex items-start justify-center flex-col">
                <p className="text-6xl mb-5">{curUser?.nickName}</p>
                <div className="flex space-x-10 text-3xl mb-12 text-stone-600">
                    <p>팔로워: {"1234"}</p>
                    <p>팔로잉: {"1234"}</p>
                </div>
                <span className="text-xl">{curUser?.greet}</span>
            </div>
            <UserInfoUpdate />
        </div>
    );
};

export default UserInfo;
