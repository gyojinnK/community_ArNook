import { Separator } from "../ui/separator";
import ImageForm from "./ImageForm";
import TextForm from "./TextForm";

const CreatePostForm = () => {
    return (
        <div className="flex relative w-full flex-col">
            {/* <div className="absolute top-12 left-12 flex justify-center items-center">
                <img src={addPost} className="w-16 mr-2" />
                <h1 className="text-5xl">게시물 생성</h1>
            </div> */}
            <TextForm />
        </div>
    );
};

export default CreatePostForm;
