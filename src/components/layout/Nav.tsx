import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import NavDropdownBox from "./NavDropdownBox";

const Nav: React.FC = () => {
    const navigate = useNavigate();
    const navCreatePostHandler = () => {
        navigate("/posting");
    };

    const navMainHandler = () => {
        navigate("/main");
    };

    return (
        <div className="fixed w-full z-40">
            <div className="flex justify-between items-center h-20 border-b bg-popover shadow-sm">
                <div
                    onClick={navMainHandler}
                    className="font-['Baumans'] text-4xl mx-10 text-stone-700 focus: cursor-pointer select-none"
                >
                    ArNook
                </div>
                <div className="mx-6 flex justify-evenly w-40 select-none">
                    <Button
                        className="self-center bg-stone-700"
                        onClick={navCreatePostHandler}
                    >
                        + 게시물
                    </Button>
                    <NavDropdownBox />
                </div>
            </div>
        </div>
    );
};

export default Nav;
