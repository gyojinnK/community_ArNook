import { fireEvent, render, waitFor } from "@testing-library/react";
import LoginForm from "@/components/authEls/LoginForm";
import { signInWithEmailAndPassword } from "firebase/auth";

// 'firebase/auth' 모듈의 'signInWithEmailAndPassword' 함수를 mock 함수로 대체
// 이렇게 하면 실제로 Firebase 서버에 요청을 보내지 않고 테스트를 진행할 수 있음
jest.mock("firebase/auth", () => ({
    auth: {},
    signInWithEmailAndPassword: jest.fn(),
}));

// describe 함수는 관련 있는 여러 테스트 그룹화
test("LoginForm component", () => {
    // it (또는 test) 함수는 개별 테스트 정의
    it("should render without crashing", () => {
        // render 함수를 사용하여 LoginForm 컴포넌트를 렌더링함
        // 이 테스트는 컴포넌트가 정상적으로 렌더링되는지 확인하기 위한 것
        render(<LoginForm onSignUpClick={jest.fn} />);
    });

    // 비동기 테스트 정의
    it("should handle form submission", async () => {
        // mock 함수 생성
        const onSignUpClick = jest.fn();
        // LoginForm 컴포넌트를 렌더링하고, 필요한 요소를 선택하는 함수를 가져옴
        const { getByPlaceholderText, getByText } = render(
            <LoginForm onSignUpClick={onSignUpClick} />
        );

        // fireEvent 함수를 사용하여 입력 이벤트를 발생시킴
        fireEvent.change(getByPlaceholderText("이메일"), {
            target: { value: "test@example.com" },
        });
        fireEvent.change(getByPlaceholderText("비밀번호"), {
            target: { value: "password" },
        });
        fireEvent.click(getByText("로그인"));

        await waitFor(() => {
            expect(signInWithEmailAndPassword).toHaveBeenCalledWith(
                expect.anything(),
                "tesxt@example.com",
                "password"
            );
        });
    });
});
