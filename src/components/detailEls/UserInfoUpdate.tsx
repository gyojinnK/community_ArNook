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
import React, { useContext, useEffect, useState } from "react";
import { UserInfoContext } from "@/store/UserInfoContext";
import { updateDoc } from "firebase/firestore";
import { getDBRef, storage } from "@/firebase/firebase";
import { AuthContext } from "@/store/AuthContext";
import { useNavigate } from "react-router-dom";
import { DialogClose } from "@radix-ui/react-dialog";
import { UserProfileContext } from "@/store/UserProfileContext";
import { Card } from "../ui/card";
import demoImage from "@/assets/image/ArNook_symbol.png";
import {
    StorageError,
    getDownloadURL,
    ref,
    uploadBytesResumable,
} from "firebase/storage";

const UserInfoUpdate: React.FC<{
    onChangePImgHandler: (x: string) => void;
}> = (props) => {
    const curAuthUser = useContext(AuthContext);
    const curUserInfo = useContext(UserInfoContext);
    const curUsetPImage = useContext(UserProfileContext);
    const [enteredNickname, setEnteredNickname] = useState("");
    // const [enteredProfileImage, SetEnteredProfileImage] = useState("");
    const [enteredGreet, setEnteredGreet] = useState("");

    const [imgFile, setImgFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const navigate = useNavigate();

    const updateSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (curAuthUser) {
                const usersRef = getDBRef(curAuthUser?.email!);
                await updateDoc(usersRef!, {
                    nickname: enteredNickname,
                    greet: enteredGreet,
                });
            }
            const imgRef = ref(storage, `profile/${curAuthUser?.email}`);
            //await deleteObject(imgRef);
            if (imgFile) {
                const uploadTask = uploadBytesResumable(imgRef, imgFile);
                uploadTask.on(
                    "state_changed",
                    (snapshot) => {
                        console.log(snapshot);
                        const progress =
                            (snapshot.bytesTransferred / snapshot.totalBytes) *
                            100;
                        console.log("Upload is " + progress + "% done");
                        switch (snapshot.state) {
                            case "paused":
                                console.log("Upload is paused");
                                break;
                            case "running":
                                console.log("Upload is running");
                                break;
                        }
                    },
                    (error: StorageError) => {
                        error.message;
                        error.stack;
                    },
                    () => {
                        getDownloadURL(uploadTask.snapshot.ref).then(
                            (downloadURL: string) => {
                                props.onChangePImgHandler(downloadURL);
                            }
                        );
                    }
                );
            } else {
                console.log("Upload Error!");
            }
            navigate("/detail");
        } catch (e) {}
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

    useEffect(() => {
        if (curUsetPImage) {
            setPreview(curUsetPImage.pImgUrl);
        }
    }, []);

    return (
        <div className="self-center lg:self-end mx-10 my-4 w-5/6 lg:w-32 text-center">
            <Dialog>
                <DialogTrigger asChild>
                    <Button className="w-full lg:w-32 bg-stone-600">
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
                        <Card className="flex flex-col justify-between items-center py-3 shadow-none">
                            <img
                                className="max-h-48 max-w-80"
                                src={preview !== null ? preview : demoImage}
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
                        <div className="grid gap-4 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label
                                    htmlFor="nickname"
                                    className="text-right"
                                >
                                    닉네임
                                </Label>
                                <Input
                                    id="nickname"
                                    value={enteredNickname}
                                    placeholder={curUserInfo?.nickName!}
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
                                    placeholder={curUserInfo?.greet!}
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
        </div>
    );
};

export default UserInfoUpdate;
