import { Avatar, AvatarImage } from "../ui/avatar";
import demoImg from "@/assets/image/ArNook_symbol.png";
import { Button } from "../ui/button";
import { Pencil1Icon, Pencil2Icon } from "@radix-ui/react-icons";

const UserInfo = () => {
    return (
        <div className="w-screen h-96 flex items-center">
            <Avatar className="w-72 h-72 ml-24 mr-16">
                <AvatarImage src={demoImg} />
            </Avatar>
            <div className="h-64 self-center flex items-start justify-center flex-col">
                <p className="text-6xl mb-5">{"UserName"}</p>
                <div className="flex space-x-10 text-3xl mb-12 text-stone-600">
                    <p>팔로워: {"1234"}</p>
                    <p>팔로잉: {"1234"}</p>
                </div>
                <span className="text-xl">
                    {"안녕하세요 소개글 소개글 테스트 글 입니다."}
                </span>
            </div>
            <div className="w-32 mx-auto">
                <Button className="">
                    <Pencil2Icon className="mr-2" />
                    프로필 수정
                </Button>
            </div>
        </div>
    );
};

export default UserInfo;
