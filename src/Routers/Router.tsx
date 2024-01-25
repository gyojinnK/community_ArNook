import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    useNavigate,
} from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import MainPage from "../pages/Main/MainPage";
import { useEffect, useState } from "react";

const Router = () => {
    const [isLogin, setIsLogin] = useState<boolean>(false);
    // const navigate = useNavigate();

    // useEffect(() => {
    //     if (!isLoggedIn()) {
    //         navigate("/");
    //     }
    // }, [navigate]);

    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route
                    path="/main"
                    element={
                        isLogin ? <MainPage /> : <Navigate to="/" replace />
                    }
                ></Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
