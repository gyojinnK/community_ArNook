import { db } from "@/utils/firebase";
import { Post } from "@/vite-env";
import React, { useEffect } from "react";
import PostCard from "../postEls/PostCard";
import { useInfiniteQuery } from "react-query";
import { useInView } from "react-intersection-observer";
import { FixedSizeList as List, ListChildComponentProps } from "react-window";
import { useMediaQuery } from "react-responsive";

const ListAllFeed = () => {
    const fetchPosts = async ({ pageParam = null }) => {
        const { query, collection, orderBy, limit, startAfter, getDocs } =
            await import("firebase/firestore");

        // 기본 쿼리
        // feed 컬렉션에서 최근 생성 문서부터 5개 가져옴
        let q = query(
            collection(db, "feed"),
            orderBy("createdAt", "desc"),
            limit(4)
        );

        // 만약 pageParam이 있다면
        // 즉, 페이지네이션이 일어난다면
        // 마지막 문서 부터 최근 생성 순서로 5개를 가져옴
        if (pageParam) {
            q = query(
                collection(db, "feed"),
                orderBy("createdAt", "desc"),
                startAfter(pageParam),
                limit(4)
            );
        }

        // 조건에 맞는 query를 적용해서 데이터 요청
        const querySnapshot = await getDocs(q);
        let tempArr: Post[] = [];
        querySnapshot.forEach((post) => {
            const splits = post.data().postId.split("|");
            const tempElement = {
                postId: splits[1],
                email: post.data().email,
                postTitle: post.data().postTitle,
                postHashtags: post.data().postHashtags,
                postContent: post.data().postContent,
                extraLink: post.data().extraLink,
                likeCount: post.data().likeCount,
                commentCount: post.data().commentCount,
                isImage: post.data().isImage,
                createdAt: post.data().createdAt,
                updatedAt: post.data().updatedAt,
            };
            tempArr.push(tempElement);
        });

        // 만약 데이터가 있다면
        // 데이터와 마지막 데이터 return
        if (tempArr.length > 0) {
            return {
                posts: tempArr,
                lastDoc: querySnapshot.docs[querySnapshot.docs.length - 1],
            };
            // 데이터가 없다면 초기화 == 무한 스크롤링 멈춤
        } else {
            return { posts: [], lastDoc: null };
        }
    };

    /**
     * Args
     * data: 서버에서 불러온 데이터를 담는 객체
     *
     * Functions
     * fetchNextPage: 다음 페이지의 데이터를 불러오는 함수. 호출되면 getNextPageParam 옵션에 따랄 새로운 페이지를 불러옴
     * hasNextPage: 다음 페이지가 있는지 여부를 나타내는 boolean 값. getNextPageParam 함수가 null을 반환하면, hasNextPage는 false가 된다.
     * isFetchingNextPage: 다음 페이지의 데이터를 현재 불러오고 있는지 여부를 나타내는 boolean값. fetchNextPage 함수가 호출되면 이 값은 true가 된다.
     * getNextPageParam: 다음 페이지를 불러올 때 사용할 파라미터를 반환하는 함수.
     *                  이 함수의 첫 번째 인자는 마지막으로 불러온 페이지의 데이터, 두 번째 인자는 지금까지 불러온 모든 페이지의 데이터를 포함하는 배열.
     *                  이 함수의 반환값은 fetchPosts 함수의 인자로 전달되며, fetchNextPage함수가 호출될 때 마다 실행.
     *                  이 함수가 null을 반환하면, hasNextPage는 false가 된다.
     */
    const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
        useInfiniteQuery("posts", fetchPosts, {
            getNextPageParam: (lastPage, _) =>
                lastPage.lastDoc ? lastPage.lastDoc : null,
        });

    const { ref, inView } = useInView({
        threshold: 0,
    });

    useEffect(() => {
        // 스크롤 위치가 마지막 요소에 도달하면 다음 페이지를 불러옵니다.
        if (inView && hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    }, [inView, hasNextPage, isFetchingNextPage]);

    const isMobile = useMediaQuery({ query: "(max-width: 780px)" });

    const itemCount = data?.pages.reduce(
        (acc, pageData) => acc + pageData.posts.length,
        0
    );
    const itemSize = 404;

    const PostRow = ({ index, style }: ListChildComponentProps) => {
        let postIndex = index;
        let pageIndex = 0;
        if (data) {
            while (postIndex >= data.pages[pageIndex].posts.length) {
                postIndex -= data.pages[pageIndex].posts.length;
                pageIndex += 1;
            }

            const postInfo = data.pages[pageIndex].posts[postIndex];

            return (
                <div style={style}>
                    <PostCard
                        key={postInfo?.postId}
                        email={postInfo?.email}
                        postId={postInfo.postId}
                        postTitle={postInfo.postTitle}
                        postHashtags={postInfo.postHashtags}
                        createdAt={postInfo.createdAt}
                        postContent={postInfo.postContent}
                        extraLink={postInfo.extraLink}
                        isImage={postInfo.isImage}
                        likeCount={postInfo.likeCount}
                    />
                </div>
            );
        }
    };

    if (isMobile) {
        // 모바일 화면일 때 react-window 적용
        return (
            <>
                <div className="w-full text-center">
                    <List
                        height={window.innerHeight}
                        itemCount={itemCount || 0}
                        itemSize={itemSize}
                        width="100%"
                    >
                        {PostRow}
                    </List>
                </div>
                <div ref={ref} className="h-5"></div>
            </>
        );
    } else {
        // 모바일 화면이 아닐 때 기존 렌더링
        return (
            <>
                <div className="w-full text-center">
                    {data?.pages.map((pageData, i) => (
                        <React.Fragment key={i}>
                            {pageData.posts.map((postInfo: Post) => (
                                <PostCard
                                    key={postInfo?.postId}
                                    email={postInfo?.email}
                                    postId={postInfo.postId}
                                    postTitle={postInfo.postTitle}
                                    postHashtags={postInfo.postHashtags}
                                    createdAt={postInfo.createdAt}
                                    postContent={postInfo.postContent}
                                    extraLink={postInfo.extraLink}
                                    isImage={postInfo.isImage}
                                    likeCount={postInfo.likeCount}
                                />
                            ))}
                        </React.Fragment>
                    ))}
                </div>
                <div ref={ref} className="h-5"></div>
            </>
        );
    }
};

export default ListAllFeed;
