/// <reference types="vite/client" />

interface AuthContextType {
    state: { isLogin: boolean; email: string };
    actions: {
        setIsLogin: React.Dispatch<React.SetStateAction<boolean>>;
        setEmail: React.Dispatch<React.SetStateAction<string>>;
    };
}

type AuthState =
    | { state: "loaded"; isAuth: boolean; user: User | null }
    | { state: "error"; error: Error };
