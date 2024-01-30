import { Dispatch, SetStateAction } from "react";
import { Input } from "../ui/input";
import searchIcon from "@/assets/vector/search.svg";

const UserSearch: React.FC<{
    onSetEnteredNname: Dispatch<SetStateAction<string | undefined>>;
}> = (props) => {
    const enteredChangeHandler = (e: React.FormEvent<HTMLInputElement>) => {
        props.onSetEnteredNname(e.currentTarget.value);
    };

    return (
        <div className="flex justify-center items-center w-full h-16 mt-4">
            <img src={searchIcon} alt="search Icon" className="mx-2" />
            <Input
                type="text"
                className="w-52 lg:w-72"
                placeholder={`이메일을 입력하세요.`}
                onChange={enteredChangeHandler}
            />
        </div>
    );
};

export default UserSearch;
