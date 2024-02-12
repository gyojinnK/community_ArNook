import { db } from "@/utils/firebase";
import { SubCommentData } from "@/vite-env";
import { collection, getDocs } from "firebase/firestore";
import { useQuery } from "react-query";
import SubCommentElement from "./SubCommentElement";

const SubCommentList: React.FC<{ postId: string; commentId: string }> = (
    props
) => {
    const fetchSubCommentHandler = async () => {
        const snapshot = await getDocs(collection(db, "comment"));
        let tempArr: SubCommentData[] = [];
        snapshot.forEach((doc) => {
            if (doc.data() && doc.data().commentId === props.commentId) {
                doc.data()?.subComments.forEach((subCom: SubCommentData) => {
                    const tempObj: SubCommentData = {
                        writerEmail: subCom.writerEmail,
                        subComment: subCom.subComment,
                        subCommentId: subCom.subCommentId,
                    };
                    tempArr.push(tempObj);
                });
            }
        });
        return tempArr;
    };

    const { data: subComments } = useQuery<SubCommentData[]>(
        ["subComments", props.commentId],
        fetchSubCommentHandler
    );

    // 캐시 구독 및 fetch함수 일단 구현 완
    // UI에 적용해보고 테스트 해야함

    return (
        <div className="ml-8">
            {subComments
                ? subComments.map((subCom, idx) => (
                      <SubCommentElement
                          key={idx}
                          subCom={subCom}
                          postId={props.postId}
                          commentId={props.commentId}
                      />
                  ))
                : null}
        </div>
    );
};

export default SubCommentList;
