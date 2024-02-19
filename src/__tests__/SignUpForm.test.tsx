import SignUpForm from "@/components/authEls/SignUpForm";
import userEvent from "@testing-library/user-event";
import {
    act,
    fireEvent,
    render,
    screen,
    waitFor,
} from "@testing-library/react";
// import { setDoc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/utils/firebase";

jest.mock("firebase/auth", () => ({
    createUserWithEmailAndPassword: jest.fn(),
    getAuth: jest.fn(),
}));

// jest.mock("@/utils/firebase", () => ({
//     auth: {},
// }));

jest.mock("firebase/firestore", () => ({
    getFirestore: jest.fn(),
    doc: jest.fn(),
    setDoc: jest.fn(),
}));

jest.mock("firebase/storage", () => ({
    getStorage: jest.fn(),
    ref: jest.fn(),
    uploadBytes: jest.fn(),
}));

jest.mock("@/assets/vector/defaultProfileImage.svg", () => "", {
    virtual: true,
});

describe("회원가입 테스트", () => {
    it("form submit 테스트", async () => {
        const onSignUpClick = jest.fn();
        const { getByTestId } = render(
            <SignUpForm onSignUpClick={onSignUpClick} />
        );

        userEvent.type(
            screen.getByPlaceholderText("이메일"),
            "testtest@gmail.com"
        );
        userEvent.type(screen.getByPlaceholderText("비밀번호"), "testtest123$");
        userEvent.type(
            screen.getByPlaceholderText("비밀번호 확인"),
            "testtest123$"
        );
        userEvent.type(screen.getByPlaceholderText("닉네임"), "testNickname");
        userEvent.type(
            screen.getByPlaceholderText("짧은 인사말"),
            "test! hello~!"
        );

        try {
            await act(async () => {
                const form = getByTestId("targetForm");
                await fireEvent.submit(form);
            });
            console.log("submit 동작!");
        } catch (error) {
            console.error(error);
        }

        await waitFor(() => {
            expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(
                auth,
                "testtest@gmail.com",
                "testtest123$"
            );
        });
    });
});
