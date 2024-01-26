import { Card } from "../ui/card";
import group from "@/assets/vector/group.svg";

const SideBar: React.FC = () => {
    return (
        <Card className="h-screen w-20 sm:w-60 rounded-none border-pop">
            <div className="w-full h-16 flex justify-center items-center">
                <div className="px-5 py-2 flex justify-between items-center hover:bg-accent rounded-sm">
                    <img src={group} className="w-8" />
                    <p className="hidden sm:inline-block text-xl mx-2">
                        계정 둘러보기
                    </p>
                </div>
            </div>
            <hr className="w-2/3 mx-auto" />
        </Card>
    );
};

export default SideBar;
