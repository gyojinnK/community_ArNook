import { AuthContext } from "@/store/AuthContext";
import { useContext, useLayoutEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

const PrivateLayout = () => {
    const navigate = useNavigate();

    const authCtx = useContext(AuthContext);

    useLayoutEffect(() => {
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
