import ContentBox from "./ContentBox";
import Nav from "./Nav";
import SideBar from "./SideBar";

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    return (
        <>
            <Nav />
            <div className="flex w-full">
                <SideBar />
                <ContentBox>{children}</ContentBox>
            </div>
        </>
    );
};

export default Layout;
