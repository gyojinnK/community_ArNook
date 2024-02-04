import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem } from "../ui/form";
import { Input } from "../ui/input";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "../ui/separator";
import React, { useContext, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { getFeedDBRef, getFeedStorageRef } from "@/utils/firebase";
import { AuthContext } from "@/store/AuthContext";
import { setDoc } from "firebase/firestore";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import addPost from "@/assets/vector/addPost.svg";
import ImageForm from "./ImageForm";
import { uploadBytes } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
    postTitle: z.string().min(2, {
        message: "2글자 이상 작성해주세요.",
    }),
    // postHashtage: z.string().array(),
    // postContent: z.string(),
});

const TextForm: React.FC = () => {
    const navigate = useNavigate();
    const [isDone, setIsDone] = useState<boolean>(false);
    const [imgFile, setImgFile] = useState<File | null>(null);
    const curUser = useContext(AuthContext);
    const [tags, setTags] = useState<string[]>([]);
    const [content, setContent] = useState<string>("");
    const [feedId, setFeedId] = useState<string>("");
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            postTitle: "",
            // postHashtage: [],
            // postContent: "",
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
        const uniqueId = uuidv4();
        const fileName = curUser?.email + "|" + uniqueId;
        try {
            if (curUser?.email) {
                const docRef = getFeedDBRef(fileName);

                await setDoc(docRef, {
                    // feedId: uuidv4(),
                    postId: fileName,
                    email: curUser.email,
                    postTitle: values.postTitle,
                    postHashtags: tags,
                    postContent: content,
                    likeCount: 0,
                    commentCount: 0,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                // const snapshot = await getDoc(docRef);
                setFeedId(uniqueId);

                console.log("성공적으로 게시했습니다.");
            }
        } catch (error) {
            console.log("게시에 실패했습니다.");
        }
    };

    useEffect(() => {
        console.log("왜왜왱", feedId, imgFile);
        const uploadFeedImage = async () => {
            if (curUser?.email && imgFile && feedId) {
                const imgRef = getFeedStorageRef(curUser?.email, feedId);
                await uploadBytes(imgRef, imgFile);
                console.log("썸네일 업로드 성공!");
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
        <div className="w-full flex justify-center items-center mt-10">
            <Card className="w-2/3">
                <CardHeader>
                    <CardTitle className="flex">
                        <img src={addPost} className="mr-2" />
                        게시물 작성하기.
                    </CardTitle>
                    <CardDescription>
                        자신만의 아늑한 생각을 담아보세요.
                    </CardDescription>
                </CardHeader>

                <Form {...form}>
                    <form className="" onSubmit={form.handleSubmit(onSubmit)}>
                        <CardContent>
                            <FormField
                                control={form.control}
                                name="postTitle"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                className="text-stone-900 text-3xl t border-none focus-visible:ring-0 focus-visible:ring-offset-0 "
                                                type="text"
                                                placeholder="제목"
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
                            <div className="flex">
                                {tags.map((tag, index) => (
                                    <Badge
                                        variant="secondary"
                                        className="text-sm mr-2"
                                        key={index}
                                        onClick={() => removeTagHandler(index)}
                                    >
                                        # {tag}
                                    </Badge>
                                ))}
                            </div>
                            <Textarea
                                className="mt-10 h-56 text-stone-500 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                                placeholder="본문을 입력해주세요."
                                value={content}
                                onChange={contentChangeHandler}
                            ></Textarea>
                        </CardContent>
                        <ImageForm
                            imgFile={imgFile}
                            setImgFile={setImgFile}
                            postImgUrl={null}
                        />
                        <CardFooter>
                            <Button
                                type="submit"
                                className="bg-white text-stone-700 w-full border border-stone-300 hover:text-white"
                            >
                                게시하기
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default TextForm;
