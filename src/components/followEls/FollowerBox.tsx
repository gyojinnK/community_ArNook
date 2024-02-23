import { CheckIcon, MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { getDBRef } from "@/utils/firebase";
import { AuthContext } from "@/store/AuthContext";
import { useContext, useEffect, useState } from "react";

const FollowerBox: React.FC<{
    otherUserEmail: string;
    otherUserNickname: string;
    flagFollowState: string;
}> = (props) => {
    const curUser = useContext(AuthContext);
    const otherDocRef = getDBRef(props.otherUserEmail);
    const [curNick, setCurNick] = useState<string>("");
    const [buttonAccess, setButtonAccess] = useState<boolean>(false);
    const [FollowDatas, setFollowDatas] = useState<
        { email: string; nickname: string }[]
    >([]);
    const [isFollow, setIsFollow] = useState<boolean>(false);

    const fetchCurNick = async () => {
        const { getDoc } = await import("firebase/firestore");
        if (curUser?.email) {
            const docRef = getDBRef(curUser.email);
            getDoc(docRef).then((snapshot) => {
                setCurNick(snapshot.data()?.nickname);
            });
        }
    };

    // 팔로우 유무 확인
    // 팔로우 엑세스 버튼이 눌릴 때마다 갱신
    const fetchCurfollowing = async () => {
        const { getDoc } = await import("firebase/firestore");
        if (curUser?.email) {
            const docRef = getDBRef(curUser.email);
            getDoc(docRef).then((ss) => {
                setFollowDatas(ss.data()?.following);
            });
        }
    };

    const checkFollow = () => {
        if (FollowDatas) {
            for (let i = 0; i < FollowDatas.length; i++) {
                if (FollowDatas[i].email === props.otherUserEmail) {
                    setIsFollow(true);
                }
            }
        } else {
            console.log("No data in Follow");
        }
    };

    const unFollowHandler = async () => {
        const { updateDoc, arrayRemove } = await import("firebase/firestore");
        if (curUser?.email) {
            const docRef = getDBRef(curUser.email);
            updateDoc(docRef!, {
                following: arrayRemove({
                    email: props.otherUserEmail,
                    nickname: props.otherUserNickname,
                }),
            });
        }
        updateDoc(otherDocRef!, {
            follower: arrayRemove({
                email: curUser?.email,
                nickname: curNick,
            }),
        });
        setButtonAccess((prev) => {
            return prev ? false : true;
        });
        setIsFollow(false);
    };

    const followHandler = async () => {
        // 자신 계정에 팔로잉 추가
        const { updateDoc, arrayUnion } = await import("firebase/firestore");
        if (curUser?.email) {
            const docRef = getDBRef(curUser.email);
            updateDoc(docRef!, {
                following: arrayUnion({
                    email: props.otherUserEmail,
                    nickname: props.otherUserNickname,
                }),
            });
        }
        // 대상 계정에 팔로워 추가
        updateDoc(otherDocRef!, {
            follower: arrayUnion({
                email: curUser?.email,
                nickname: curNick,
            }),
        });

        setButtonAccess((prev) => {
            return prev ? false : true;
        });
    };

    useEffect(() => {
        fetchCurNick();
    }, []);

    useEffect(() => {
        fetchCurfollowing();
    }, [buttonAccess]);

    // 팔로우 확인
    useEffect(() => {
        checkFollow();
    }, [FollowDatas]);

    return (
        <>
            {isFollow && props.flagFollowState === "following" ? (
                <Button
                    onClick={unFollowHandler}
                    className="self-center lg:self-end mx-10 my-4 w-5/6 lg:w-28 text-center bg-stone-700"
                >
                    <MinusIcon className="mr-2" />
                    언팔로우
                </Button>
            ) : isFollow && props.flagFollowState === "follower" ? (
                <Button className="self-center lg:self-end mx-10 my-4 w-5/6 lg:w-28 text-center bg-green-700 hover:bg-green-700 focus: cursor-default">
                    <CheckIcon className="mr-2" />
                    팔로잉 중
                </Button>
            ) : (
                <Button
                    onClick={followHandler}
                    className="self-center lg:self-end mx-10 my-4 w-5/6 lg:w-28 text-center"
                >
                    <PlusIcon className="mr-2" />
                    팔로우
                </Button>
            )}
        </>
    );
};

export default FollowerBox;
