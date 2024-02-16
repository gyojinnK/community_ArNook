import Layout from "@/components/layout/Layout";
import UsersViewWrap from "@/components/usersViewEls/UsersViewWrap";
import { Helmet } from "react-helmet";

const UsersViewPage = () => {
    return (
        <>
            <Helmet>
                <title>Users - Arnook</title>
                <meta name="description" content="유저 둘러보기 페이지" />
            </Helmet>
            <Layout>
                <UsersViewWrap />
            </Layout>
        </>
    );
};

export default UsersViewPage;
