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
    return (
        <Card>
            <CardHeader className="py-3">
                <CardTitle className="text-lg">댓글</CardTitle>
            </CardHeader>
            <CardContent>
                <CommentList email={props.email} postId={props.postId} />
            </CardContent>
            <CardFooter>
                <CommentForm email={props.email} postId={props.postId} />
            </CardFooter>
        </Card>
    );
};

export default CommentWrap;
