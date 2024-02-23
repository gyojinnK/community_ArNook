import UserCard from "./UserCard";
import { storage } from "@/utils/firebase";
import { useContext, useEffect, useMemo, useState } from "react";
import UserSearch from "./UserSearch";
import { debounce } from "lodash-es";
import { AuthContext } from "@/store/AuthContext";

const UsersViewWrap: React.FC = () => {
    const curUser = useContext(AuthContext);
    const [profileNameList, setProfileNameList] = useState<string[]>();
    const [enteredNname, setEnteredNname] = useState<string | undefined>();

    const debouncedSetEnteredNname = debounce(setEnteredNname, 500);

    const fetchAllUserList = async () => {
        const { listAll, ref } = await import("firebase/storage");
        const listRef = ref(storage, "profile");
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
    };

    useEffect(() => {
        fetchAllUserList();
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
