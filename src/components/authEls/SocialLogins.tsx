import { signInWithPopup } from "firebase/auth";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { auth, db, githubProvider, googleProvider } from "@/firebase/firebase";
import { doc, setDoc } from "firebase/firestore";
import googleLogo from "@/assets/vector/googleLogo.svg";
import githubLogo from "@/assets/vector/githubLogo.svg";

const SocialLogins = () => {
    // const googleLoginHandler = async () => {
    //     const data = await signInWithPopup(auth, googleProvider);
    //     console.log(data);
    // };

    // const githubLoginHandler = async () => {
    //     const data = await signInWithPopup(auth, githubProvider);
    //     console.log(data);
    // };

    return (
        <div className="flex relative justify-evenly items-center">
            <div className="absolute top-auto left-auto z-40 text-xl text-white/80  w-full rounded-md bg-stone-400/80 py-2">
                refactoring...
            </div>
            <Avatar
                className="w-8 h-8"
                // onClick={googleLoginHandler}
            >
                <AvatarImage src={googleLogo} />
                <AvatarFallback>Google Login</AvatarFallback>
            </Avatar>
            <Avatar
                className="w-8 h-8"
                // onClick={githubLoginHandler}
            >
                <AvatarImage src={githubLogo} />
                <AvatarFallback>Github Login</AvatarFallback>
            </Avatar>
        </div>
    );
};

export default SocialLogins;
