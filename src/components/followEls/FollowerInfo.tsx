import { useContext, useEffect, useState } from "react";
import { Button } from "../ui/button";
import { AuthContext } from "@/store/AuthContext";
import { getDBRef } from "@/utils/firebase";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { ScrollArea } from "../ui/scroll-area";
import FollowerBox from "@/components/followEls/FollowerBox";
import { Separator } from "../ui/separator";

const FollowerInfo = () => {
    const curUser = useContext(AuthContext);
    const [FollowerDatas, setFollowerDatas] = useState<
        { email: string; nickname: string }[]
    >([]);
    const [followerCount, setFollowerCount] = useState<number>(0);
    const [cheker, setChecker] = useState<boolean>(false);

    useEffect(() => {
        const fetchFollowerData = async () => {
            const { getDoc } = await import("firebase/firestore");
            if (curUser?.email) {
                const docRef = getDBRef(curUser.email);
                getDoc(docRef)
                    .then((ss) => {
                        setFollowerDatas(ss.data()?.follower);
                    })
                    .then(() => setFollowerCount(FollowerDatas.length));
            }
        };
        fetchFollowerData();
    }, [cheker]);

    useEffect(() => {
        setFollowerCount(FollowerDatas.length);
    }, [FollowerDatas]);

    const followListUpdateHandler = () => {
        setChecker((prev) => {
            return prev ? false : true;
        });
    };

    // return <Button variant="outline">팔로워 {followerCount}</Button>;
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={followListUpdateHandler}>
                    팔로워 {followerCount}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>팔로워한 유저</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-56 w-full rounded-md border">
                    {FollowerDatas.length !== 0 ? (
                        FollowerDatas.map((follower) => {
                            return (
                                <div key={Math.random()}>
                                    <div
                                        className="flex justify-between items-center"
                                        onClick={followListUpdateHandler}
                                    >
                                        <h4 className="mx-8 text-md font-medium leading-none">
                                            {follower.email}
                                        </h4>
                                        <FollowerBox
                                            key={Math.random()}
                                            otherUserEmail={follower.email}
                                            otherUserNickname={
                                                follower.nickname
                                            }
                                        />
                                    </div>
                                    <Separator />
                                </div>
                            );
                        })
                    ) : (
                        <div className="my-10 mx-10 text-stone-500">
                            팔로워가 없습니다...
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

// 팔로워 리스트 보여줘야함

export default FollowerInfo;
