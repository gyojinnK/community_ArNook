import Layout from "@/components/layout/Layout";
import OtherUserInfo from "@/components/otherDetailEls/OtherUserInfo";
import { Helmet } from "react-helmet";

const OtherDetailPage: React.FC = () => {
    return (
        <>
            <Helmet>
                <title>Detail - Arnook</title>
                <meta name="description" content="사용자 상세 페이지" />
            </Helmet>
            <Layout>
                <OtherUserInfo />
            </Layout>
        </>
    );
};

export default OtherDetailPage;
