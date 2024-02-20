import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { auth } from "@/utils/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import SignUpNavBox from "./SignUpNavBox";
import SocialLogins from "./SocialLogins";

const formSchema = z.object({
    email: z.string(),
    password: z.string(),
});

const LoginForm: React.FC<{ onSignUpClick: () => void }> = (props) => {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password
            );
        } catch (e) {
            if (e instanceof Error) {
                e.message;
                e.stack;
            }
        }
    };

    return (
        <div className="flex flex-col w-80 lg:w-96">
            <Card className="mb-5 text-center">
                <CardHeader>
                    <CardTitle className="font-['Baumans'] text-6xl text-stone-700">
                        ArNook
                    </CardTitle>
                </CardHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="inline-block mx-auto"
                    >
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
                                    </FormItem>
                                )}
                            />

                            <hr></hr>

                            <div>소셜 로그인</div>
                            <SocialLogins />
                        </CardContent>
                        <CardFooter>
                            <Button type="submit" className="mx-auto">
                                로그인
                            </Button>
                        </CardFooter>
                    </form>
                </Form>
            </Card>
            <SignUpNavBox onSignUpClick={props.onSignUpClick} />
        </div>
    );
};

export default LoginForm;
