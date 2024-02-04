import { useEffect } from "react";
import "./App.css";
import { auth } from "./utils/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

function App() {
    useEffect(() => {
        createUserWithEmailAndPassword(auth, "test@gmail.com", "12341234");
    }, []);

    return (
        <div className="w-full h-screen flex flex-col justify-start items-center"></div>
    );
}

export default App;
