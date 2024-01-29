import { useContext, useEffect, useState } from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { UserProfileContext } from "@/store/UserProfileContext";
import demoImg from "@/assets/image/ArNook_symbol.png";

const UserAvatar: React.FC<{
    curPImageId: string | null | undefined;
}> = (props) => {
    return (
        <Avatar className="w-72 h-72 ml-24 mr-16">
            <AvatarImage
                src={props.curPImageId ? props.curPImageId : demoImg}
            />
        </Avatar>
    );
};

export default UserAvatar;
