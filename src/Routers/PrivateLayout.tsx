import { auth } from "@/firebase";
import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

const PrivateLayout = () => {
    const navigate = useNavigate();
    const { pathname } = useLocation();

    useEffect(() => {
        if (auth.currentUser === null) {
            navigate("/", { state: pathname });
        }
    }, []);

    return (
        <div>
            <Outlet />
        </div>
    );
};

export default PrivateLayout;
