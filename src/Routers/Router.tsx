import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import MainPage from "../pages/Main/MainPage";
import UsersViewPage from "@/pages/UsersView/UsersViewPage";
import DetailPage from "@/pages/Detail/DetailPage";
import PostingPage from "@/pages/Post/PostingPage";
import PrivateLayout from "./PrivateLayout";
import PublicLayout from "./PublicLayout";
import { AuthContextProvider } from "@/store/AuthContext";
import { UserInfoProvider } from "@/store/userInfoContext";
import { UserProfileProvier } from "@/store/UserProfileContext";

const Router = () => {
    return (
        <BrowserRouter>
            <AuthContextProvider>
                <UserInfoProvider>
                    <UserProfileProvier>
                        <Routes>
                            <Route element={<PublicLayout />}>
                                <Route path="/" element={<LoginPage />} />
                            </Route>
                            <Route element={<PrivateLayout />}>
                                <Route
                                    path="/main"
                                    element={<MainPage />}
                                ></Route>
                                <Route
                                    path="/usersView"
                                    element={<UsersViewPage />}
                                />
                                <Route
                                    path="/detail"
                                    element={<DetailPage />}
                                />
                                <Route
                                    path="/posting"
                                    element={<PostingPage />}
                                />
                            </Route>
                        </Routes>
                    </UserProfileProvier>
                </UserInfoProvider>
            </AuthContextProvider>
        </BrowserRouter>
    );
};

export default Router;
