import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

const UserAvatar: React.FC<{
    curPImageId: string;
}> = (props) => {
    return (
        <Avatar className="w-64 h-64 my-6 mx-10 xl:w-72 xl:h-72">
            <AvatarImage src={props.curPImageId} />
            <AvatarFallback>
                <Skeleton className="h-full w-full rounded-full bg-stone-800" />
            </AvatarFallback>
        </Avatar>
    );
};

export default UserAvatar;
