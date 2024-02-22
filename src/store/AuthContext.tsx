import { auth } from "@/utils/firebase";
import { User } from "firebase/auth";
import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext<User | null>(null);

export const AuthContextProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [user, setUser] = useState<User | null>(null);

    const onChange = (user: User | null) => {
        if (user) {
            setUser(user);
        } else {
            setUser(user);
        }
    };
    useEffect(() => {
        const fetchAuthChanged = async () => {
            const { onAuthStateChanged } = await import("firebase/auth");
            const subscribe = onAuthStateChanged(auth, onChange);
            return subscribe;
        };
        fetchAuthChanged();
    }, []);

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
