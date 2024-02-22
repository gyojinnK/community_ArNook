import { FormEvent, useContext, useState } from "react";
import { Button } from "../ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { AuthContext } from "@/store/AuthContext";
import { getDBRef } from "@/utils/firebase";

// zod로 다시하기
const UpdatePwForm: React.FC<{ onSetIsOpenPw: () => void }> = (props) => {
    const [enteredCurPassword, setEnteredCurPassword] = useState<string>("");
    const [enteredNewPassword, setEnteredNewPassword] = useState<string>("");
    const curUser = useContext(AuthContext);
    const dbRef = getDBRef(curUser?.email!);

    const changeCurPassword = (e: FormEvent<HTMLInputElement>) => {
        const {
            currentTarget: { value },
        } = e;
        setEnteredCurPassword(value);
    };
    const changeNewPassword = (e: FormEvent<HTMLInputElement>) => {
        const {
            currentTarget: { value },
        } = e;
        setEnteredNewPassword(value);
    };
    const fetchPassword = async () => {
        const { getDoc } = await import("firebase/firestore");
        const snapshot = await getDoc(dbRef!);
        if (snapshot) {
            return snapshot.data()?.password;
        }
    };

    const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { updatePassword } = await import("firebase/auth");
            const curUserPassword = fetchPassword;
            if (String(curUserPassword) === enteredCurPassword && curUser) {
                updatePassword(curUser, enteredNewPassword)
                    .then(() => {
                        console.log("Successful!");
                    })
                    .catch((error: Error) => {
                        error.stack;
                    });
            }
        } catch (eror) {
            console.log("Update Error");
            props.onSetIsOpenPw;
        }
    };

    return (
        <div className="fixed flex justify-center items-center top-0 left-0 w-full h-full z-50 bg-black/80">
            <Card className="w-96">
                <CardHeader>
                    <CardTitle>비밀번호 변경</CardTitle>
                    <CardDescription>
                        새로운 비밀번호를 설정해주세요.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={onSubmitHandler}>
                        <div className="grid w-full items-center gap-4">
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="curPw">현재 비밀번호</Label>
                                <Input
                                    type="password"
                                    id="curPw"
                                    value={enteredCurPassword}
                                    onChange={changeCurPassword}
                                />
                            </div>
                            <div className="flex flex-col space-y-1.5">
                                <Label htmlFor="newPw">새로운 비밀번호</Label>
                                <Input
                                    type="password"
                                    id="newPw"
                                    value={enteredNewPassword}
                                    onChange={changeNewPassword}
                                />
                            </div>
                        </div>
                    </form>
                </CardContent>
                <CardFooter className="flex justify-between">
                    <Button variant="outline" onClick={props.onSetIsOpenPw}>
                        취소하기
                    </Button>
                    <Button type="submit">변경하기</Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default UpdatePwForm;
