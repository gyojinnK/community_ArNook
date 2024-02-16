import Layout from "@/components/layout/Layout";
import ListAllFeed from "@/components/mainEls/ListAllFeed";
import { Helmet } from "react-helmet";

const MainPage = () => {
    return (
        <>
            <Helmet>
                <title>Home - Arnook </title>
                <meta name="description" content="메인 페이지" />
            </Helmet>
            <Layout>
                <ListAllFeed />
            </Layout>
        </>
    );
};

export default MainPage;
