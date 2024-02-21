import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import person from "@/assets/vector/person.svg";
import out from "@/assets/vector/out.svg";
import { auth } from "@/utils/firebase";
import { signOut } from "firebase/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { UserProfileContext } from "@/store/UserProfileContext";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";

const NavDropdownBox: React.FC = () => {
    const curProfile = useContext(UserProfileContext);
    const navigate = useNavigate();
    const location = useLocation();
    const onLogoutHandler = async () => {
        await signOut(auth);
        navigate("/");
    };

    const navigateDetailHandler = () => {
        if (location.pathname !== "/detail") {
            navigate("/detail");
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className="w-11 h-11">
                        <AvatarImage src={curProfile?.pImgUrl} alt="" />
                        <AvatarFallback>
                            <Skeleton className="h-full w-full rounded-full bg-stone-800" />
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56">
                    <DropdownMenuLabel>사용자 메뉴</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={navigateDetailHandler}>
                        마이페이지
                        <DropdownMenuShortcut>
                            <img src={person} alt="mypage" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={onLogoutHandler}>
                        로그아웃
                        <DropdownMenuShortcut>
                            <img src={out} alt="logout" />
                        </DropdownMenuShortcut>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </>
    );
};

export default NavDropdownBox;
