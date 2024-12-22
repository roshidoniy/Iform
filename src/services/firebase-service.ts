import { FirebaseError, initializeApp } from "firebase/app";
import firebaseConfig from "../secrets/firebaseSDK";
import { User } from "./firebase.types";
import { getFirestore, doc, collection, setDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const app = initializeApp(firebaseConfig);

async function addUserToDB({email, password}: User) {
    try {
        const db = getFirestore(app);
        const userRef = doc(collection(db, 'usersDB'));
        setDoc(userRef, {
            email: email,
            password: password
        });
    } catch (error) {
        console.log("Damn girl, that's an error")
        throw error;
    }
}

async function signUpUser(userInfo: User) {
    try {
        const auth = getAuth(app);
        await addUserToDB(userInfo);
        const userCredential = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password);
        const user = userCredential.user;
        return user
    } catch (error) {
        if(error instanceof FirebaseError){
            console.log("I have given you:", error);
        }
        }
}

async function signInWithGoogle() {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = await result.user;
        await addUserToDB({email: user.email!, password: user.uid}); 
        // console.log("User signed in with Google:", user);
        return user;
    } catch (error) {
        console.error("Error signing in with Google:", error);
    }
}


export { signUpUser, signInWithGoogle }