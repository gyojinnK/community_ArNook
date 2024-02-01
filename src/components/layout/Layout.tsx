import { useState } from "react";
import ContentBox from "./ContentBox";
import Nav from "./Nav";
import SideBar from "./SideBar";
import UpdatePwForm from "./UpdatePwForm";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isOpenPw, setIsOpenPw] = useState<boolean>(false);

    const clickIsOpenPwHandler = () => {
        setIsOpenPw(() => {
            return isOpenPw ? false : true;
        });
    };

    return (
        <div className="w-full h-full relative">
            <Nav onSetIsOpenPw={clickIsOpenPwHandler} />
            <div className="flex w-full">
                <SideBar />
                <div className="mt-20 h-screen w-1/6 lg:w-1/4"></div>
                <ContentBox>{children}</ContentBox>
            </div>
            {isOpenPw ? (
                <UpdatePwForm onSetIsOpenPw={clickIsOpenPwHandler} />
            ) : null}
        </div>
    );
};

export default Layout;
