import { MinusIcon, PlusIcon } from "@radix-ui/react-icons";
import { Button } from "../ui/button";
import { getDBRef } from "@/firebase/firebase";
import { AuthContext } from "@/store/AuthContext";
import { useContext, useEffect, useState } from "react";
import { arrayRemove, arrayUnion, getDoc, updateDoc } from "firebase/firestore";

const FollowerBox: React.FC<{
    otherUserEmail: string;
    otherUserNickname: string;
}> = (props) => {
    const curUser = useContext(AuthContext);
    const otherDocRef = getDBRef(props.otherUserEmail);
    const [curNick, setCurNick] = useState<string>("");
    const [buttonAccess, setButtonAccess] = useState<boolean>(false);
    const [FollowDatas, setFollowDatas] = useState<
        { email: string; nickname: string }[]
    >([]);
    const [isFollow, setIsFollow] = useState<boolean>(false);

    useEffect(() => {
        if (curUser?.email) {
            const docRef = getDBRef(curUser.email);
            getDoc(docRef).then((snapshot) => {
                setCurNick(snapshot.data()?.nickname);
            });
        }
    }, []);

    // 팔로우 유무 확인
    // 팔로우 엑세스 버튼이 눌릴 때마다 갱신
    useEffect(() => {
        if (curUser?.email) {
            const docRef = getDBRef(curUser.email);
            getDoc(docRef).then((ss) => {
                setFollowDatas(ss.data()?.following);
            });
        }
    }, [buttonAccess]);

    // 팔로우 확인
    useEffect(() => {
        if (FollowDatas) {
            for (let i = 0; i < FollowDatas.length; i++) {
                if (FollowDatas[i].email === props.otherUserEmail) {
                    setIsFollow(true);
                }
            }
        } else {
            console.log("No data in Follow");
        }
    }, [FollowDatas]);

    const unFollowHandler = async () => {
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

    return (
        <>
            {isFollow ? (
                <Button
                    onClick={unFollowHandler}
                    className="self-center lg:self-end mx-10 my-4 w-5/6 lg:w-28 text-center bg-stone-700"
                >
                    <MinusIcon className="mr-2" />
                    언팔로우
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
