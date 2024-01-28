import { auth } from "@/firebase/firebase";
import { User, onAuthStateChanged } from "firebase/auth";
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
        const subscribe = onAuthStateChanged(auth, onChange);
        return subscribe;
    }, []);

    return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
