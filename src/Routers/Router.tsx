import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "../pages/Login/LoginPage";
import MainPage from "../pages/Main/MainPage";
import UsersViewPage from "@/pages/UsersView/UsersViewPage";
import DetailPage from "@/pages/Detail/DetailPage";
import PostingPage from "@/pages/Post/PostingPage";
import { auth } from "@/firebase";
import PrivateLayout from "./PrivateLayout";
import PublicLayout from "./PublicLayout";

const Router = () => {
    return (
        <BrowserRouter>
            <Routes>
                <Route element={<PublicLayout />}>
                    <Route path="/" element={<LoginPage />} />
                </Route>
                <Route element={<PrivateLayout />}>
                    <Route path="/main" element={<MainPage />}></Route>
                    <Route path="/usersView" element={<UsersViewPage />} />
                    <Route path="/detail" element={<DetailPage />} />
                    <Route path="/posting" element={<PostingPage />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
};

export default Router;
