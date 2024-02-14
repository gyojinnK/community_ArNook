import { useRef } from "react";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import CommentForm from "./CommentForm";
import CommentList from "./CommentList";

const CommentWrap: React.FC<{
    email: string;
    postId: string;
    profileImgPath: string;
}> = (props) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    return (
        <Card>
            <CardHeader className="py-3">
                <CardTitle className="text-lg">댓글</CardTitle>
            </CardHeader>
            <CardContent>
                <CommentList
                    scrollRef={scrollRef}
                    email={props.email}
                    postId={props.postId}
                />
            </CardContent>
            <CardFooter>
                <CommentForm
                    scrollRef={scrollRef}
                    email={props.email}
                    postId={props.postId}
                />
            </CardFooter>
        </Card>
    );
};

export default CommentWrap;
