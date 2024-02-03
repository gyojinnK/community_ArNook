import { useEffect, useState } from "react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "../ui/card";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import defaultImg from "@/assets/vector/defaultImage.svg";

const ImageForm: React.FC<{
    imgFile: File | null;
    setImgFile: React.Dispatch<React.SetStateAction<File | null>>;
    postImgUrl: string | null;
}> = (props) => {
    // const [imgFile, setImgFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>("");

    const fileChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return null;
        props.setImgFile(files[0]);
    };

    useEffect(() => {
        if (props.imgFile) {
            const reader = new FileReader();
            reader.onload = () => {
                setPreview(reader.result as string);
            };
            reader.readAsDataURL(props.imgFile);
        } else {
            setPreview(props.postImgUrl);
        }
    }, [props.imgFile]);

    return (
        <div className=" w-full h-full flex justify-center items-center mt-10">
            <Card className="w-11/12 h-11/12">
                <CardHeader>
                    <CardTitle>썸네일 추가하기</CardTitle>
                    <CardDescription>
                        썸네일 이미지는 필수가 아닌 선택입니다.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Card className="flex flex-col justify-between items-center py-3 shadow-none">
                        <img
                            className="max-h-48 max-w-80"
                            src={preview !== null ? preview : defaultImg}
                        />
                    </Card>
                    <Label
                        htmlFor="inputFile"
                        className="text-stone-400 inline-block w-full text-right underline focus: cursor-pointer hover:text-blue-600 "
                    >
                        썸네일 이미지 선택
                    </Label>
                    <Input
                        className="hidden"
                        type="file"
                        accept="image/*"
                        id="inputFile"
                        onChange={fileChangeHandler}
                    />
                </CardContent>
            </Card>
        </div>
    );
};

export default ImageForm;
