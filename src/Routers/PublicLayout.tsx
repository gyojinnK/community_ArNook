import { AuthContext } from "@/store/AuthContext";
import { useContext, useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const PublicLayout = () => {
    const authCtx = useContext(AuthContext);
    const navigate = useNavigate();

    useLayoutEffect(() => {
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

export default PublicLayout;
