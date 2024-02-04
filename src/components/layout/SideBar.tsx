import { useNavigate } from "react-router-dom";
import { Card } from "../ui/card";
import group from "@/assets/vector/group.svg";
import home from "@/assets/vector/home.svg";

const SideBar: React.FC = () => {
    const navigate = useNavigate();
    const navigateMainHandler = () => {
        navigate("/main");
    };
    const navigateUserListHandler = () => {
        navigate("/usersView");
    };

    return (
        <>
            <Card className="fixed mt-20 h-screen w-1/6 lg:w-1/6 rounded-none border-pop">
                <div className="w-full h-16 flex justify-center items-center">
                    <div
                        onClick={navigateMainHandler}
                        className="px-2 lg:px-5 lg:py-2 flex justify-between items-center hover:bg-accent rounded-sm focus: cursor-pointer"
                    >
                        <img src={home} className="w-8" />
                        <p className="hidden lg:inline-block text-xl mx-2 ">
                            Home
                        </p>
                    </div>
                </div>
                <div className="w-full h-16 flex justify-center items-center">
                    <div
                        onClick={navigateUserListHandler}
                        className="px-2 lg:px-5 lg:py-2 flex justify-between items-center hover:bg-accent rounded-sm focus: cursor-pointer"
                    >
                        <img src={group} className="w-8" />
                        <p className="hidden lg:inline-block text-xl mx-2 ">
                            Users
                        </p>
                    </div>
                </div>

                <hr className="w-2/3 mx-auto" />
            </Card>
        </>
    );
};

export default SideBar;
