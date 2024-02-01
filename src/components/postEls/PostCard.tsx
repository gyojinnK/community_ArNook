import { Timestamp } from "firebase/firestore";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";

const PostCard: React.FC<{
    postTitle: string;
    createdAt: Timestamp;
    postContent: string;
}> = (props) => {
    return (
        <Card className="text-left w-80 h-96 mx-10 my-10 rounded-3xl inline-block bg-stone-100/50">
            <CardHeader>
                <CardTitle>{props.postTitle}</CardTitle>
                <CardDescription>
                    {props.createdAt.toDate().toUTCString()}
                </CardDescription>
            </CardHeader>
            <CardContent>{props.postContent}</CardContent>
            <CardFooter></CardFooter>
        </Card>
    );
};

export default PostCard;
