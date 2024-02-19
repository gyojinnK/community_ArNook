import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import MainPage from "../pages/MainPage";
import UsersViewPage from "@/pages/UsersViewPage";
import DetailPage from "@/pages/DetailPage";
import PostingPage from "@/pages/PostingPage";
import PrivateLayout from "./PrivateLayout";
import PublicLayout from "./PublicLayout";
import { AuthContextProvider } from "@/store/AuthContext";
import { UserInfoProvider } from "@/store/UserInfoContext";
import { UserProfileProvier } from "@/store/UserProfileContext";
import OtherDetailPage from "@/pages/OtherDetailPage";
import ScrollTop from "./ScrollTop";
import { QueryClient, QueryClientProvider } from "react-query";

const Router = () => {
    const queryClient = new QueryClient();

    return (
        <BrowserRouter>
            <ScrollTop />
            <AuthContextProvider>
                <UserInfoProvider>
                    <UserProfileProvier>
                        <QueryClientProvider client={queryClient}>
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
                                        path="otherDetail"
                                        element={<OtherDetailPage />}
                                    />
                                    <Route
                                        path="/posting"
                                        element={<PostingPage />}
                                    />
                                </Route>
                            </Routes>
                        </QueryClientProvider>
                    </UserProfileProvier>
                </UserInfoProvider>
            </AuthContextProvider>
        </BrowserRouter>
    );
};

export default Router;
