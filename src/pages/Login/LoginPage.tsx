import { useLocation, useNavigate } from "react-router-dom";
import LoginForm from "./LoginForm";
import SignUpFrom from "./SignUpForm";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { state } = useLocation();

    if (state) {
        navigate(state);
    } else {
        navigate("/");
    }

    return (
        <div>
            <LoginForm />
            <SignUpFrom />
        </div>
    );
};

export default LoginPage;
