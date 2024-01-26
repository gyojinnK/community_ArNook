import MainPage from "@/pages/Main/MainPage";
import { AuthContext } from "@/store/AuthContext";
import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom";

const PrivateLayout = () => {
    const navigate = useNavigate();

    const authCtx = useContext(AuthContext);

    useEffect(() => {
        console.log("인증 유지 상태: ", authCtx);
        if (authCtx) {
            navigate("/main");
        } else {
            navigate("/");
        }
    }, [authCtx]);

    return (
        <div>
            <Outlet />
        </div>
    );
};

export default PrivateLayout;
