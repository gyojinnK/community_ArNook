import { Avatar, AvatarImage } from "../ui/avatar";
import demoImg from "@/assets/vector/defaultProfileImage.svg";

const UserAvatar: React.FC<{
    curPImageId: string | null | undefined;
}> = (props) => {
    return (
        <Avatar className="w-64 h-64 my-6 mx-10 xl:w-72 xl:h-72">
            <AvatarImage
                src={props.curPImageId ? props.curPImageId : demoImg}
            />
        </Avatar>
    );
};

export default UserAvatar;
