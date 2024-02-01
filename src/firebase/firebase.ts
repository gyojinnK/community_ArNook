// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {
    GithubAuthProvider,
    GoogleAuthProvider,
    User,
    getAuth,
} from "firebase/auth";
import {
    DocumentData,
    DocumentReference,
    doc,
    getFirestore,
} from "firebase/firestore";
import { getStorage, ref } from "firebase/storage";
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
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Social Login
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();

// User DB Ref
export const getDBRef = (curUserEmail: string) => {
    let dbRef: DocumentReference<DocumentData> | undefined;
    dbRef = doc(db, "users", curUserEmail);
    return dbRef;
};

// Feed DB Ref
export const getFeedDBRef = (feedId: string) => {
    let dbRef: DocumentReference<DocumentData> | undefined;
    dbRef = doc(db, "feed", feedId);
    return dbRef;
};

// Feed Image Storage Ref
export const getFeedStorageRef = (curUserEmail: string, feedId: string) => {
    const imgRef = ref(storage, `feedImg/${curUserEmail}/${feedId}`);
    return imgRef;
};
