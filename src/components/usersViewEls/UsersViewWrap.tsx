import { listAll, ref } from "firebase/storage";
import UserCard from "./UserCard";
import { storage } from "@/utils/firebase";
import { useContext, useEffect, useMemo, useState } from "react";
import UserSearch from "./UserSearch";
import { debounce } from "lodash";
import { AuthContext } from "@/store/AuthContext";

const UsersViewWrap: React.FC = () => {
    const curUser = useContext(AuthContext);
    const listRef = ref(storage, "profile");
    const [profileNameList, setProfileNameList] = useState<string[]>();
    const [enteredNname, setEnteredNname] = useState<string | undefined>();
    // const [filteredNameList, setFilteredNameList] = useState<string[]>();

    const debouncedSetEnteredNname = debounce(setEnteredNname, 500);

    useEffect(() => {
        listAll(listRef)
            .then((res) => {
                const tempArr: string[] = [];
                res.items.map((item) => {
                    if (curUser?.email !== item.name) tempArr.push(item.name);
                });
                setProfileNameList(tempArr);
            })
            .catch((error: Error) => {
                error.message;
            });
    }, []);

    const filteredNameList = useMemo(() => {
        if (enteredNname) {
            return profileNameList?.filter((item) => {
                return item?.includes(enteredNname);
            });
        }
    }, [enteredNname, profileNameList]);

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
