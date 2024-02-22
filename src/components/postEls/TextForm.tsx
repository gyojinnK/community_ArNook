import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "../ui/separator";
import React, { useContext, useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Textarea } from "../ui/textarea";
import { getFeedDBRef, getFeedStorageRef } from "@/utils/firebase";
import { AuthContext } from "@/store/AuthContext";
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
import { v4 as uuidv4 } from "uuid";
import { useNavigate } from "react-router-dom";
import { Link2Icon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";

const formSchema = z.object({
    postTitle: z.string().min(2, {
        message: "2글자 이상 작성해주세요.",
    }),
    postContent: z.string().min(10, {
        message: "10글자 이상 작성해주세요.",
    }),
    extraLink: z.string(),
    // .regex(
    //     /^(http|https|ftp):\/\/[-a-zA-Z0-9@:%._\+~#?&//=]+$/,
    //     "잘못된 링크 형식입니다."
    // ),
});

const TextForm: React.FC = () => {
    const navigate = useNavigate();
    const [isDone, setIsDone] = useState<boolean>(false);
    const [isAddImgOpen, setIsAddImgOpen] = useState<boolean>(false);
    const [isAddLinkOpen, setIsAddLinkOpen] = useState<boolean>(false);
    const [imgFile, setImgFile] = useState<File | null>(null);
    const curUser = useContext(AuthContext);
    const [tags, setTags] = useState<string[]>([]);
    const [feedId, setFeedId] = useState<string>("");
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            postTitle: "",
            postContent: "",
            extraLink: "",
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

    const addImgOpenHandler = () => {
        setIsAddImgOpen((prev) => {
            return prev ? false : true;
        });
    };

    const addLinkHandler = () => {
        setIsAddLinkOpen((prev) => {
            return prev ? false : true;
        });
    };

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        const uniqueId = uuidv4();
        const fileName = curUser?.email + "|" + uniqueId;
        try {
            if (curUser?.email) {
                const { setDoc } = await import("firebase/firestore");
                const docRef = getFeedDBRef(fileName);

                await setDoc(docRef, {
                    postId: fileName,
                    email: curUser.email,
                    postTitle: values.postTitle,
                    postHashtags: tags,
                    postContent: values.postContent,
                    extraLink: values.extraLink,
                    likeCount: 0,
                    commentCount: 0,
                    isImage: imgFile ? true : false,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                });

                setFeedId(uniqueId);

                console.log("성공적으로 게시했습니다.");
            }
        } catch (error) {
            console.log("게시에 실패했습니다.");
        }
    };

    useEffect(() => {
        const uploadFeedImage = async () => {
            if (curUser?.email && feedId) {
                const { uploadBytes } = await import("firebase/storage");
                const imgRef = getFeedStorageRef(curUser?.email, feedId);
                if (imgFile) {
                    await uploadBytes(imgRef, imgFile);
                    console.log("썸네일 게시물 업로드 성공!");
                }
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
                        <img src={addPost} className="mr-2" alt="Add Post" />
                        게시물 생성하기
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
                                        <FormMessage />
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
                            <FormField
                                control={form.control}
                                name="postContent"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Textarea
                                                className="my-5 h-1/2 text-stone-500 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                                                placeholder="본문을 입력해주세요."
                                                {...field}
                                            ></Textarea>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="button"
                                variant="outline"
                                className="w-full"
                                onClick={addImgOpenHandler}
                            >
                                {isAddImgOpen ? (
                                    <>
                                        <MinusIcon className="mr-2" />
                                        <div>썸네일 취소하기</div>
                                    </>
                                ) : (
                                    <>
                                        <PlusIcon className="mr-2" />
                                        <div>썸네일 첨부하기</div>
                                    </>
                                )}
                            </Button>
                            {isAddImgOpen ? (
                                <ImageForm
                                    imgFile={imgFile}
                                    setImgFile={setImgFile}
                                    postImgUrl={null}
                                />
                            ) : null}

                            <Button
                                type="button"
                                variant="outline"
                                className="w-full mt-5"
                                onClick={addLinkHandler}
                            >
                                {isAddLinkOpen ? (
                                    <>
                                        <MinusIcon className="mr-2" />
                                        <div>링크 취소하기</div>
                                    </>
                                ) : (
                                    <>
                                        <PlusIcon className="mr-2" />
                                        <div>링크 추가하기</div>
                                    </>
                                )}
                            </Button>
                            {isAddLinkOpen ? (
                                <Card className="mt-5">
                                    <CardHeader>
                                        <CardTitle>링크 추가하기</CardTitle>
                                        <CardDescription>
                                            참조할 링크를 추가합니다.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="flex justify-start items-center">
                                        <Card className="w-10 h-10 flex justify-center items-center rounded-r-none">
                                            <Link2Icon />
                                        </Card>
                                        <FormField
                                            control={form.control}
                                            name="extraLink"
                                            render={({ field }) => (
                                                <FormItem className="w-full">
                                                    <FormControl>
                                                        <Input
                                                            type="text"
                                                            className="w-full"
                                                            {...field}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            )}
                                        />
                                    </CardContent>
                                    <CardFooter />
                                    <FormMessage />
                                </Card>
                            ) : null}
                        </CardContent>
                        <CardFooter>
                            <Button
                                type="submit"
                                className="w-full border border-stone-300 mt-10"
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
