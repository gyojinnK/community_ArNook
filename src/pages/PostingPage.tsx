import Layout from "@/components/layout/Layout";
import CreatePostForm from "@/components/postEls/CreatePostForm";
import { Helmet } from "react-helmet";

const PostingPage = () => {
    return (
        <>
            <Helmet>
                <title>Create Post - Arnook</title>
                <meta name="description" content="게시물 생성 페이지" />
            </Helmet>
            <Layout>
                <CreatePostForm />
            </Layout>
        </>
    );
};

export default PostingPage;
