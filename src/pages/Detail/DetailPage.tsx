import Nav from "@/components/layout/Nav";
import SideBar from "@/components/layout/SideBar";
import UserInfo from "@/components/userinfo/UserInfo";

const DetailPage = () => {
    return (
        <>
            <Nav></Nav>
            <div className="flex">
                <SideBar />
                <UserInfo />
            </div>
        </>
    );
};

export default DetailPage;
