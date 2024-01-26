import { Button } from "../ui/button";
import NavDropdownBox from "./NavDropdownBox";

const Nav = () => {
    return (
        <div className="flex justify-between items-center h-20 border-b border-stone-900">
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
