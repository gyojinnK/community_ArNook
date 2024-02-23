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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { useForm } from "react-hook-form";
import { Input } from "../ui/input";
import { Card, CardContent } from "../ui/card";
import { Separator } from "../ui/separator";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getFeedDBRef, getFeedStorageRef } from "@/utils/firebase";
import { Timestamp } from "firebase/firestore";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import ImageForm from "./ImageForm";
import { deleteObject } from "firebase/storage";

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
    const [isImg, setIsImg] = useState<boolean>(false);
    // const curUser = useContext(AuthContext);
    const [tags, setTags] = useState<string[]>(props.postHashtags);
    const [content, setContent] = useState<string>(props.postContent);
    // const [feedId, setFeedId] = useState<string>("");
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
            const { setDoc } = await import("firebase/firestore");
            if (props.email) {
                const docRef = getFeedDBRef(fileName);
                await setDoc(docRef, {
                    postId: fileName,
                    email: props.email,
                    postTitle: values.postTitle,
                    postHashtags: tags,
                    postContent: content,
                    likeCount: 0,
                    isImage: imgFile ? true : false,
                    commentCount: 0,
                    createdAt: props.createdAt,
                    updatedAt: new Date(),
                });

                if (imgFile) {
                    uploadFeedImage(imgFile);
                } else {
                    deleteFeedImage();
                }

                props.onClose(false);
            }
            setIsDone(true);
        } catch (error) {
            alert("Post Update - API ERROR");
        }
    };
    const uploadFeedImage = async (imgFile: File) => {
        if (props.email && imgFile && props.postId) {
            const { uploadBytes } = await import("firebase/storage");
            const imgRef = getFeedStorageRef(props.email, props.postId);
            await uploadBytes(imgRef, imgFile);
            alert("Post Update - Success Upload");
        }
    };
    const deleteFeedImage = async () => {
        const fileName = props.email + "|" + props.postId;
        try {
            const { getDoc, setDoc } = await import("firebase/firestore");
            const docRef = getFeedDBRef(fileName);
            const snapshot = await getDoc(docRef);
            if (snapshot.data()?.isImage) {
                const imgRef = getFeedStorageRef(props.email, props.postId);
                await deleteObject(imgRef);
                await setDoc(docRef, {
                    isImage: false,
                });
                alert("Post Update - Success Delete");
            }
        } catch (error) {
            alert("Post Update - API error");
        }
    };

    // 이미지 있는 경우
    //  -> 이미지 수정 --> 기존 이미지 삭제 --> 새로운 이미지 업로드
    // 이미지 없는 경우
    //  -> 이미지 추가 --> 새로운 이미지 업로드

    // useEffect(() => {
    //     if (imgFile) {
    //         deleteFeedImage();
    //         uploadFeedImage();
    //     }
    // }, [isImg]);

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
