import { initializeApp } from "firebase/app";
import firebaseConfig from "../secrets/firebaseSDK";
// import { getFirestore, doc, getDoc, } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
const app = initializeApp(firebaseConfig);

// const firestore = getFirestore(app);

async function signUpUser(email: string, password: string) {
    try {
    const auth = getAuth(app);  
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    return user
    } catch (error) {
        console.error("Error signing up:", error);
    }

}

async function signInWithGoogle() {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        console.log("User signed in with Google:", user);
        return user;
    } catch (error) {
        console.error("Error signing in with Google:", error);
        throw error; // Rethrow the error for handling in the UI
    }
}


// async function getAlumniWishes(id: string) {

//     const docRef = doc(firestore, 'alumnis', id);


//     const docSnap = await getDoc(docRef);

//     if (docSnap.exists()) {
//         return docSnap.data()
//     } else {
//         console.log('No such document!');
//     }
// }


export { signUpUser, signInWithGoogle } 