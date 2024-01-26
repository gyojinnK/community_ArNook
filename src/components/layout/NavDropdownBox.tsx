import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuShortcut,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import person from "@/assets/vector/person.svg";
import out from "@/assets/vector/out.svg";
import demoAt from "@/assets/image/ArNook_symbol.png";
import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

const NavDropdownBox: React.FC = () => {
    const navigate = useNavigate();
    const onLogoutHandler = async () => {
        await signOut(auth);
        navigate("/");
    };

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Avatar className="w-12 h-12">
                    <AvatarImage src={demoAt} />
                    <AvatarFallback>userName</AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56">
                <DropdownMenuLabel>사용자 메뉴</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
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
    );
};

export default NavDropdownBox;
