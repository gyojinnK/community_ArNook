import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

const UserAvatar: React.FC<{
    curPImageId: string;
}> = (props) => {
    return (
        <Avatar className="w-60 h-60 lg:w-64 lg:h-64 my-6 mx-10 xl:w-72 xl:h-72">
            <AvatarImage
                src={props.curPImageId}
                alt="User Profile Image"
                className="object-cover"
            />
            <AvatarFallback>
                <Skeleton className="h-full w-full rounded-full bg-stone-800" />
            </AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;
