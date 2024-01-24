// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDSN9XzO1FNMEyK2jIJMQUzHHa4tMUg14M",
    authDomain: "arnook-381bb.firebaseapp.com",
    projectId: "arnook-381bb",
    storageBucket: "arnook-381bb.appspot.com",
    messagingSenderId: "810789038557",
    appId: "1:810789038557:web:274711dc31eae1fd852e34",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
