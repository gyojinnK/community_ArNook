import Layout from "@/components/layout/Layout";
import UserInfo from "@/components/detailEls/UserInfo";
import { Helmet } from "react-helmet";

const DetailPage = () => {
    return (
        <>
            <Helmet>
                <title>Detail - Arnook</title>
                <meta name="description" content="사용자 상세 페이지" />
            </Helmet>
            <Layout>
                <UserInfo />
            </Layout>
        </>
    );
};

export default DetailPage;
