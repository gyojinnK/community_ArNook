import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { auth, storage } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { db } from "@/utils/firebase";
import { setDoc, doc } from "firebase/firestore";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { useContext, useEffect, useState } from "react";
import { ref, uploadBytes } from "firebase/storage";
import demoPImg from "@/assets/vector/defaultProfileImage.svg";
import { Label } from "../ui/label";
import { AuthContext } from "@/store/AuthContext";
import { useNavigate } from "react-router-dom";

const formSchema = z.object({
    nickname: z.string().min(2, {
        message: "2글자 이상 작성해주세요.",
    }),
    //profileImage: z.object(),
    greet: z.string().min(2, {
        message: "2글자 이상 작성해주세요.",
    }),
});

const SocialLoginExtraForm: React.FC = () => {
    const [imgFile, setImgFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>("");
    const curUser = useContext(AuthContext);
    const navigate = useNavigate();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            nickname: "",
            greet: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            if (imgFile) {
                const imgRef = ref(storage, `profile/${curUser?.displayName}`);
                await uploadBytes(imgRef, imgFile);
                console.log("Success Upload File!");
            } else {
                console.log("No File!");
            }

            if (curUser?.displayName) {
                const docRef = await setDoc(
                    doc(db, "users", curUser?.displayName),
                    {
                        nickname: values.nickname,
                        //profileImage: ,
                        greet: values.greet,
                    }
                );
                console.log("Document written with ID: ", docRef);
                navigate("/main");
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log(String(error));
            }
        }
    };

    const gobackHandler = () => {
        signOut(auth);
        navigate("/");
    };

    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return null;
        setImgFile(files[0]);
    };

    useEffect(() => {
        if (imgFile) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(imgFile);
        } else {
            setPreview(null);
        }
    }, [imgFile]);

    return (
        <div>
            <Card className="w-96 mb-5 text-center">
                <CardHeader>
                    <CardTitle className="font-['Baumans'] text-6xl text-stone-700">
                        ArNook
                    </CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)}>
                        <CardDescription className="mb-5">
                            추가적인 정보를 입력해주세요.
                        </CardDescription>
                        <CardContent className="space-y-3">
                            <Card className="flex flex-col justify-between items-center py-3 shadow-none">
                                <img
                                    className="max-h-48 max-w-80"
                                    src={preview !== null ? preview : demoPImg}
                                />
                            </Card>

                            <Label
                                htmlFor="inputFile"
                                className="text-stone-400 underline focus: cursor-pointer hover:text-blue-600 "
                            >
                                프로필 이미지 선택
                            </Label>

                            <input
                                className="hidden"
                                type="file"
                                accept="image/*"
                                id="inputFile"
                                onChange={fileChangeHandler}
                            />
                            <FormField
                                control={form.control}
                                name="nickname"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="닉네임"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="greet"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="text"
                                                placeholder="짧은 인사말"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </CardContent>
                        <CardFooter className="flex justify-between">
                            <Button onClick={gobackHandler} className="mx-2">
                                취소하기
                            </Button>
                            <Button type="submit" className="mx-2">
                                가입하기
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
        </div>
    );
};

export default SocialLoginExtraForm;
