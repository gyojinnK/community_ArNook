import { Pencil2Icon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import React, { useContext, useState } from "react";
import { UserInfoContext } from "@/store/userInfoContext";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";
import { AuthContext } from "@/store/AuthContext";
import { useNavigate } from "react-router-dom";
import { DialogClose } from "@radix-ui/react-dialog";

const UserInfoUpdate: React.FC = () => {
    const curAuthUser = useContext(AuthContext);
    const curUserInfo = useContext(UserInfoContext);
    const [enteredNickname, setEnteredNickname] = useState("");
    // const [enteredProfileImage, SetEnteredProfileImage] = useState("");
    const [enteredGreet, setEnteredGreet] = useState("");

    const navigate = useNavigate();

    const updateSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const usersRef = doc(db, "users", curAuthUser?.email);
        await updateDoc(usersRef, {
            nickname: enteredNickname,
            greet: enteredGreet,
        });
        navigate("/detail");
    };

    const NickNamechangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
        const {
            currentTarget: { value },
        } = e;

        setEnteredNickname(value);
    };

    const GreetChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
        const {
            currentTarget: { value },
        } = e;

        setEnteredGreet(value);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button>
                    <Pencil2Icon className="mr-2" />
                    프로필 수정
                </Button>
            </DialogTrigger>
            <DialogContent>
                <form onSubmit={updateSubmitHandler}>
                    <DialogHeader>
                        <DialogTitle>프로필 수정</DialogTitle>
                        <DialogDescription>
                            사용자 정보를 수정하세요
                        </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="nickname" className="text-right">
                                닉네임
                            </Label>
                            <Input
                                id="nickname"
                                value={enteredNickname}
                                placeholder={curUserInfo?.nickName}
                                className="col-span-3"
                                onChange={NickNamechangeHandler}
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="greet" className="text-right">
                                인사말
                            </Label>
                            <Input
                                id="greet"
                                value={enteredGreet}
                                placeholder={curUserInfo?.greet}
                                className="col-span-3"
                                onChange={GreetChangeHandler}
                            />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="submit">저장하기</Button>
                        </DialogClose>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UserInfoUpdate;
