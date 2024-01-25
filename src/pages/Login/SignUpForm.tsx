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

const SignUpForm = () => {
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
            console.log("Success from Firebase", userCredential.user);
            console.log("input values", values);
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
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormControl>
                                <Input placeholder="이메일" {...field} />
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
                <Button type="submit">가입하기</Button>
            </form>
        </Form>
    );
};

export default SignUpForm;
