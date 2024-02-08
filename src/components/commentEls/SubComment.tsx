import { Cross2Icon } from "@radix-ui/react-icons";
import { Input } from "../ui/input";
import {
    Dispatch,
    MutableRefObject,
    SetStateAction,
    useEffect,
    useRef,
} from "react";

const SubComment: React.FC<{
    onOpen: Dispatch<SetStateAction<boolean>>;
    isOpen: boolean;
}> = (props) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const closeHandler = () => {
        props.onOpen(false);
    };

    // 아직 해결 못함
    useEffect(() => {
        if (props.isOpen && inputRef.current !== null) {
            inputRef.current.focus();
            console.log("focus 완료");
        }
    }, [props.isOpen]);

    return (
        <form className="flex justify-start items-center">
            <Cross2Icon
                className="opacity-60 ml-5 w-3 h-3 focus: cursor-pointer rounded-md hover:bg-stone-300"
                onClick={closeHandler}
            />
            <Input
                className="focus-visible:ring-0 focus-visible:ring-offset-0 text-xs p-1 border-0 h-fit w-fit ml-1"
                placeholder="답글 달기"
                ref={inputRef}
            ></Input>
        </form>
    );
};

export default SubComment;
