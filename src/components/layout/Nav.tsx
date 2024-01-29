import { Button } from "../ui/button";
import NavDropdownBox from "./NavDropdownBox";

const Nav: React.FC<{ onSetIsOpenPw: () => void }> = (props) => {
    return (
        <div className="fixed w-full z-40">
            <div className="flex justify-between items-center h-20 border-b bg-popover shadow-sm">
                <div className="font-['Baumans'] text-4xl mx-10 text-stone-700">
                    ArNook
                </div>
                <div className="mx-6 flex justify-evenly w-40">
                    <Button className="self-center bg-stone-700">
                        + 게시물
                    </Button>
                    <NavDropdownBox onSetIsOpenPw={props.onSetIsOpenPw} />
                </div>
            </div>
        </div>
    );
};

export default Nav;
