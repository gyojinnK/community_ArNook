import { useState } from "react";
import LoginForm from "../components/authEls/LoginForm";
import SignUpFrom from "../components/authEls/SignUpForm";
import symbol from "@/assets/image/ArNook_symbol.png";

const LoginPage: React.FC = () => {
    const [isSignUp, setIsSignUp] = useState<boolean>(false);

    const signUpClickHandler = () => {
        setIsSignUp((prev) => {
            return prev ? false : true;
        });
    };

    return (
        <div className="h-screen flex justify-center items-center">
            <div className="sm:flex relative flex-col h-screen mx-20 justify-center items-center hidden">
                <div className="self-start w-80 space-y-2 absolute left-8 text-white/70">
                    <p className="text-4xl">나만의</p>
                    <p className="text-7xl text-center font-['Baumans']">
                        ArNook한
                    </p>
                    <p className="text-3xl text-right">저장소</p>
                </div>
                <img src={symbol} className="w-96" />
                {/* <dd className="font-['Baumans'] text-5xl">ArNook</dd> */}
            </div>
            {isSignUp ? (
                <SignUpFrom onSignUpClick={signUpClickHandler} />
            ) : (
                <LoginForm onSignUpClick={signUpClickHandler} />
            )}
        </div>
    );
};

export default LoginPage;
