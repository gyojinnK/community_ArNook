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
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@/utils/firebase";
import { setDoc, doc } from "firebase/firestore";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { useEffect, useState } from "react";
import { ref, uploadBytes } from "firebase/storage";
import demoPImg from "@/assets/vector/defaultProfileImage.svg";
import { Label } from "../ui/label";

const formSchema = z
    .object({
        email: z
            .string()
            .regex(
                /^[a-zA-Z0-9+-_.]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$/,
                "잘못된 이메일 입니다."
            ),
        password: z
            .string()
            .regex(
                /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,15}$/,
                "영문+숫자+특수문자(! @ # $ % & * ?) 조합 8~15자리를 입력해주세요."
            ),
        passwordCheck: z.string(),
        nickname: z.string().min(2, {
            message: "2글자 이상 작성해주세요.",
        }),
        //profileImage: z.object(),
        greet: z.string().min(2, {
            message: "2글자 이상 작성해주세요.",
        }),
        follower: z.string().array(),
        following: z.string().array(),
    })
    .refine((data) => data.password === data.passwordCheck, {
        path: ["passwordCheck"],
        message: "비밀번호가 일치하지 않습니다.",
    });

const SignUpForm: React.FC<{ onSignUpClick: () => void }> = (props) => {
    const [imgFile, setImgFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>("");

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordCheck: "",
            nickname: "",
            // profileImage: "",
            greet: "",
            follower: [],
            following: [],
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );

            if (userCredential) {
                props.onSignUpClick();
            }

            if (imgFile) {
                const imgRef = ref(storage, `profile/${values.email}`);
                await uploadBytes(imgRef, imgFile);
                console.log("Success Upload File!");
            } else {
                console.log("No File!");
            }

            const docRef = await setDoc(doc(db, "users", values.email), {
                password: values.password,
                nickname: values.nickname,
                //profileImage: ,
                greet: values.greet,
                follower: [],
                following: [],
            });
            console.log("Document written with ID: ", docRef);
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log(String(error));
            }
        }
        props.onSignUpClick;
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
            <Card className="w-80 lg:w-96 mb-5 text-center">
                <CardHeader>
                    <CardTitle className="font-['Baumans'] text-6xl text-stone-700">
                        ArNook
                    </CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form
                        id="targetForm"
                        data-testid="targetForm"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
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
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                placeholder="이메일"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        {/* <FormDescription>
                                            8자 이상, 알파벳과 숫자, 특수문자
                                            포함하
                                        </FormDescription> */}
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="비밀번호"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="passwordCheck"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormControl>
                                            <Input
                                                type="password"
                                                placeholder="비밀번호 확인"
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
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
                            <Button
                                onClick={props.onSignUpClick}
                                className="mx-2"
                            >
                                뒤로가기
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

export default SignUpForm;
