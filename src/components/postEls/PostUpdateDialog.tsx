import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFeedDBRef, getFeedStorageRef } from "@/utils/firebase";
import { Timestamp, setDoc } from "firebase/firestore";
import { uploadBytes } from "firebase/storage";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import ImageForm from "./ImageForm";

const formSchema = z.object({
    postTitle: z.string().min(2, {
        message: "2글자 이상 작성해주세요.",
    }),
});

const PostUpdateDialog: React.FC<{
    email: string;
    postId: string;
    postTitle: string;
    postHashtags: string[];
    postContent: string;
    createdAt: Timestamp;
    postImgUrl: string;
    onClose: React.Dispatch<React.SetStateAction<boolean>>;
}> = (props) => {
    const navigate = useNavigate();
    const [isDone, setIsDone] = useState<boolean>(false);
    const [imgFile, setImgFile] = useState<File | null>(null);
    // const curUser = useContext(AuthContext);
    const [tags, setTags] = useState<string[]>(props.postHashtags);
    const [content, setContent] = useState<string>(props.postContent);
    const [feedId, setFeedId] = useState<string>("");
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            postTitle: "",
        },
    });

    const keydownHandler = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            const value = e.currentTarget.value.trim();
            if (value && !tags.includes(value)) {
                setTags([...tags, value]);
            }
            e.currentTarget.value = "";
        }
    };

    const removeTagHandler = (index: number) => {
        setTags(tags.filter((_, i) => i !== index));
    };

    const contentChangeHandler = (e: React.FormEvent<HTMLTextAreaElement>) => {
        setContent(e.currentTarget.value);
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const fileName = props.email + "|" + props.postId;
        try {
            if (props.email) {
                const docRef = getFeedDBRef(fileName);

                await setDoc(docRef, {
                    // feedId: uuidv4(),
                    postId: fileName,
                    email: props.email,
                    postTitle: values.postTitle,
                    postHashtags: tags,
                    postContent: content,
                    likeCount: 0,
                    commentCount: 0,
                    createdAt: props.createdAt,
                    updatedAt: new Date(),
                });

                // const snapshot = await getDoc(docRef);
                setFeedId(props.postId);
                console.log("성공적으로 수정했습니다.");
                props.onClose(false);
            }
        } catch (error) {
            console.log("수정 실패했습니다.");
        }
    };

    useEffect(() => {
        const uploadFeedImage = async () => {
            if (props.email && imgFile && feedId) {
                const imgRef = getFeedStorageRef(props.email, feedId);
                await uploadBytes(imgRef, imgFile);
                console.log("썸네일 수정 성공!");
                setIsDone(true);
            }
        };
        if (imgFile) {
            uploadFeedImage();
        } else if (feedId) {
            setIsDone(true);
        }
    }, [feedId]);

    useEffect(() => {
        if (isDone) {
            navigate("/detail");
        }
    }, [isDone]);

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="mx-2">
                    수정하기
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>게시물 수정</DialogTitle>
                    <DialogDescription>게시물를 수정합니다.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                        <Card className="h-96 overflow-scroll">
                            <CardContent className="mt-5">
                                <FormField
                                    control={form.control}
                                    name="postTitle"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className="text-stone-900 text-3xl t border-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                                                    type="text"
                                                    placeholder={
                                                        props.postTitle
                                                    }
                                                    {...field}
                                                />
                                            </FormControl>
                                        </FormItem>
                                    )}
                                />
                                <Separator className="mt-2" />
                                <Input
                                    className="text-stone-500 text-sm  border-none focus-visible:ring-0 focus-visible:ring-offset-0"
                                    onKeyDown={keydownHandler}
                                    placeholder="태그를 입력해주세요. 클릭하면 삭제합니다."
                                />
                                <div className="w-full">
                                    {tags.map((tag, index) => (
                                        <Badge
                                            variant="secondary"
                                            className="text-sm mr-2 mb-1 inline-block"
                                            key={index}
                                            onClick={() =>
                                                removeTagHandler(index)
                                            }
                                        >
                                            # {tag}
                                        </Badge>
                                    ))}
                                </div>
                                <Textarea
                                    className="mt-10 text-stone-500 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                                    placeholder={props.postContent}
                                    value={content}
                                    onChange={contentChangeHandler}
                                ></Textarea>
                                <ImageForm
                                    imgFile={imgFile}
                                    setImgFile={setImgFile}
                                    postImgUrl={props.postImgUrl}
                                />
                            </CardContent>
                        </Card>
                        <DialogFooter className="flex justify-between mt-5 w-full">
                            <Button variant="default" type="submit">
                                수정하기
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
};

export default PostUpdateDialog;
