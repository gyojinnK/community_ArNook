import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import FollowerBox from "@/components/followEls/FollowerBox";
import { getDBRef } from "@/utils/firebase";
import { AuthContext } from "@/store/AuthContext";
import { useContext, useEffect, useState } from "react";
import { Separator } from "../ui/separator";

const FollowingInfo: React.FC = () => {
    const curUser = useContext(AuthContext);
    const [FollowingDatas, setFollowingDatas] = useState<
        { email: string; nickname: string }[]
    >([]);
    const [cheker, setChecker] = useState<boolean>(false);
    const [followingCount, setFollowingCount] = useState<number>(0);

    useEffect(() => {
        const fetchFollowingData = async () => {
            const { getDoc } = await import("firebase/firestore");
            if (curUser?.email) {
                const docRef = getDBRef(curUser.email);

                getDoc(docRef).then((ss) => {
                    setFollowingDatas(ss.data()?.following);
                });
            }
        };
        fetchFollowingData();
    }, [cheker, curUser?.email]);

    useEffect(() => {
        setFollowingCount(FollowingDatas.length);
    }, [FollowingDatas]);

    const followListUpdateHandler = () => {
        setChecker((prev) => {
            return prev ? false : true;
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" onClick={followListUpdateHandler}>
                    팔로잉 {followingCount}
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>팔로잉한 유저</DialogTitle>
                </DialogHeader>
                <ScrollArea className="h-56 w-full rounded-md border">
                    {FollowingDatas.length !== 0 ? (
                        FollowingDatas.map((following) => {
                            return (
                                <div key={Math.random()}>
                                    <div
                                        className="flex justify-between items-center"
                                        onClick={followListUpdateHandler}
                                        key={Math.random()}
                                    >
                                        <h4 className="mx-8 text-md font-medium leading-none">
                                            {following.email}
                                        </h4>
                                        <FollowerBox
                                            key={Math.random()}
                                            otherUserEmail={following.email}
                                            otherUserNickname={
                                                following.nickname
                                            }
                                        />
                                    </div>
                                    <Separator />
                                </div>
                            );
                        })
                    ) : (
                        <div className="my-10 mx-10 text-stone-500">
                            팔로잉이 없습니다...
                        </div>
                    )}
                </ScrollArea>
            </DialogContent>
        </Dialog>
    );
};

export default FollowingInfo;
