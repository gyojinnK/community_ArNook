import { Card, CardDescription } from "../ui/card";

const SignUpNavBox: React.FC<{ onSignUpClick: () => void }> = (props) => {
    return (
        <Card className="flex w-96 h-14 justify-center items-center">
            <CardDescription className="inline-block mr-5">
                아직 가입을 안하셨나요?
            </CardDescription>
            <a
                onClick={props.onSignUpClick}
                className="text-sm inline-block focus: cursor-pointer hover:text-purple-500 text-stone-500"
            >
                회원가입
            </a>
        </Card>
    );
};

export default SignUpNavBox;
