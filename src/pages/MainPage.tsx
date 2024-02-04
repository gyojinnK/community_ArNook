import Layout from "@/components/layout/Layout";
import ListAllFeed from "@/components/mainEls/ListAllFeed";
import { QueryClient, QueryClientProvider } from "react-query";

const MainPage = () => {
    const queryClient = new QueryClient();
    return (
        <>
            <Layout>
                <QueryClientProvider client={queryClient}>
                    <ListAllFeed />
                </QueryClientProvider>
            </Layout>
        </>
    );
};

export default MainPage;
