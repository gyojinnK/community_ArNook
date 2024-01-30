import { listAll, ref } from "firebase/storage";
import UserCard from "./UserCard";
import { storage } from "@/firebase/firebase";
import { useEffect, useState } from "react";
import UserSearch from "./UserSearch";
import { debounce } from "lodash";

const UsersViewWrap: React.FC = () => {
    const listRef = ref(storage, "profile");
    const [profileNameList, setProfileNameList] = useState<string[]>();
    const [enteredNname, setEnteredNname] = useState<string | undefined>();
    const [filteredNameList, setFilteredNameList] = useState<string[]>();

    const debouncedSetEnteredNname = debounce(setEnteredNname, 500);

    useEffect(() => {
        listAll(listRef)
            .then((res) => {
                const tempArr: string[] = [];
                res.items.map((item) => {
                    tempArr.push(item.name);
                });
                setProfileNameList(tempArr);
            })
            .catch((error: Error) => {
                error.message;
            });
    }, []);

    useEffect(() => {
        if (enteredNname) {
            const temp = profileNameList?.filter((item) => {
                return item?.includes(enteredNname);
            });

            setFilteredNameList(temp);
        }
    }, [enteredNname]);

    return (
        <div className="w-full text-center">
            <UserSearch onSetEnteredNname={debouncedSetEnteredNname} />
            {enteredNname
                ? filteredNameList?.map((names) => (
                      <UserCard key={names} imgName={names} />
                  ))
                : profileNameList?.map((names) => (
                      <UserCard key={names} imgName={names} />
                  ))}
        </div>
    );
};

export default UsersViewWrap;
