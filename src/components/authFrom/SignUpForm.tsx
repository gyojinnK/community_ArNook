import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { auth } from "@/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { db } from "@/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";

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
        profileImage: z.string(),
        greet: z.string().min(2, {
            message: "2글자 이상 작성해주세요.",
        }),
    })
    .refine((data) => data.password === data.passwordCheck, {
        path: ["passwordCheck"],
        message: "비밀번호가 일치하지 않습니다.",
    });

const SignUpForm: React.FC<{ onSignUpClick: () => void }> = (props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
            passwordCheck: "",
            nickname: "",
            profileImage: "",
            greet: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log(typeof values.email);
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
            if (userCredential) {
                props.onSignUpClick();
            }
        } catch (error) {
            if (error instanceof Error) {
                console.log(error.message);
            } else {
                console.log(String(error));
            }
        }

        try {
            const docRef = await addDoc(collection(db, "users"), {
                email: values.email,
                password: values.password,
                nickname: values.nickname,
                profileImage: values.profileImage,
                greet: values.greet,
            });
            console.log("Document written with ID: ", docRef.id);
        } catch (e) {
            console.error("Error adding document: ", e);
        }

        props.onSignUpClick;
    };

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
                        <CardContent className="space-y-3">
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
                            <Card className="shadow-sm">
                                <FormField
                                    control={form.control}
                                    name="profileImage"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>프로필 이미지</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="file"
                                                    placeholder="프로필 이미지"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </Card>
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
