import { FirebaseError, initializeApp } from "firebase/app";
import firebaseConfig from "../keys/firebaseSDK";
import type { User, UserData } from "../types/types";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot, serverTimestamp } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword, sendEmailVerification } from "firebase/auth";

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function addUserToDB(email: string): Promise<void> {
    const userRef = doc(db, 'usersDB', email);
    const docSnap = await getDoc(userRef)
    
    if(docSnap.exists()) {
        throw new Error("Email already exists");
    }

    await setDoc(userRef, { 
        email: email,
        admins: [],
        author_admin: [],
        templatesID: [],
        answered: [],
        liked: [],
        commented: [],
        createdAt: serverTimestamp(),
    });
}

async function addAdmin(creatorEmail: string, adminEmail: string): Promise<void> {
    const adminRef = doc(db, 'usersDB', adminEmail);
    const ownerRef = doc(db, 'usersDB', creatorEmail);
    const adminDocSnap = await getDoc(adminRef);

    if(adminEmail == creatorEmail){
        throw new Error("You cannot add yourself as an admin");
    }

    if(adminDocSnap.exists()) {
        await updateDoc(ownerRef, {
            "admins": arrayUnion(adminEmail)
        })
        await updateDoc(adminRef, {
            "author_admin": arrayUnion(creatorEmail)
        })
    }
    else{
        throw new Error("Admin does not exist");
    }
}

function getAdmins(ownerEmail: string, onUpdate: (admins: string[]) => void, onError?: (error: Error) => void) {
    const userRef = doc(db, 'usersDB', ownerEmail);
    
    return onSnapshot(
        userRef,
        (doc) => {
            if (doc.exists()) {
                const userData: UserData = doc.data() as UserData;
                onUpdate(userData.admins || []);
            } else {
                onUpdate([]);
            }
        },
        (error) => {
            console.error("Error fetching admins:", error);
            if (onError) {
                onError(error);
            }
        }
    );
}

async function deleteAdmin(ownerEmail: string, adminEmail: string): Promise<void> {
    const ownerRef = doc(db, 'usersDB', ownerEmail);
    const adminRef = doc(db, 'usersDB', adminEmail);

    await updateDoc(ownerRef, {
        "admins": arrayRemove(adminEmail)
    })

    await updateDoc(adminRef, {
        "author_admin": arrayRemove(ownerEmail)
    })
}

async function signUpUser(userInfo: User) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, userInfo.email, userInfo.password);
        sendEmailVerification(userCredential.user)
        await addUserToDB(userInfo.email);
        const user = userCredential.user;
        return user
    } catch (error) {
        if(error instanceof FirebaseError){
            throw new Error(error.code)
        }
        else if(error instanceof Error){
            throw new Error(error.message)
        }
    }
}

async function continueWithGoogle() {
    const auth = getAuth(app);
    const provider = new GoogleAuthProvider();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = await result.user;
        await addUserToDB(user.email as string); 
        return user;
    } catch (error) {
        if(error instanceof FirebaseError){
            console.error("Error signing in with Google:", error.code);
            throw error;
        }
    }
}

async function signInWithPassword(email: string, password: string): Promise<void> {
    try {
        const auth = getAuth(app);
        await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
        if(error instanceof FirebaseError){
            console.error("Error signing in with password:", error.code);
            throw error;
        }
    }
}

export { 
    signUpUser, 
    continueWithGoogle, 
    signInWithPassword, 
    addAdmin, 
    getAdmins, 
    deleteAdmin,
    db,
    auth 
}; 