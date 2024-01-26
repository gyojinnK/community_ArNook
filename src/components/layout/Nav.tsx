import { Button } from "../ui/button";
import NavDropdownBox from "./NavDropdownBox";

const Nav: React.FC = () => {
    return (
        <div className="flex justify-between w-full items-center h-20 border-b bg-popover shadow-sm">
            <div className="font-['Baumans'] text-4xl mx-14 text-stone-700">
                ArNook
            </div>
            <div className="mx-14 flex justify-between w-40">
                <Button className="self-center bg-stone-700">+ 게시물</Button>
                <NavDropdownBox />
            </div>
        </div>
    );
};

export default Nav;
