import { FirebaseError, initializeApp } from "firebase/app";
import firebaseConfig from "../keys/firebaseSDK";
import type { Template, FormData, User, UserData } from "../types/types";
import { getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, onSnapshot, collection, serverTimestamp, query, where, getDocs, deleteDoc} from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

async function submitForm(formData: FormData): Promise<void> {
    const templateRef = doc(db, "templatesDB", formData.templateID!);
    const userRef = doc(db, "usersDB", formData.authorEmail!);

    await updateDoc(templateRef, {
        answers: arrayUnion({authorEmail: formData.authorEmail, answer: formData.answer})
    })

    await updateDoc(userRef, {
        answered: arrayUnion({ authorEmail: formData.authorEmail, answer: formData.answer })
    })
}

async function searchTemplates(searchQuery: string): Promise<Partial<Template>[]> {
    if(!searchQuery) return []

    const templateCol = collection(db, "templatesDB");
    const templateDoc = await getDocs(templateCol);
    const searchResults: Partial<Template>[] = [];

    if(templateDoc.empty) return []

    templateDoc.docs.forEach((doc) => {
        if(doc.data().title.toLowerCase().includes(searchQuery.toLowerCase())){
            searchResults.push({
                id: doc.id as string,
                title: doc.data().title as string,
                description: doc.data().description as string,
                image_url: doc.data().image_url as string,
            })
        }
    })
    return searchResults
}

async function createTemplate(creatorEmail: string): Promise<string> {
    const userRef = doc(db, "usersDB", creatorEmail)

    const templateInitialData = {
        title: "New Template",
        creator: auth.currentUser?.email,
        description: "",
        image_url: "",
        questions: [],
        answers: [],
        likes: 0,
        createdAt: serverTimestamp(),
    }

    const templateRef = doc(collection(db, "templatesDB"));

    await setDoc(templateRef, {...templateInitialData, id: templateRef.id})

    await updateDoc(userRef, {
        templatesID: arrayUnion(templateRef.id)
    })

    return templateRef.id
}

async function deleteTemplate(creatorEmail: string, templateID: string) {
    const templateCol = collection(db, "templatesDB");
    const userRef = doc(db, "usersDB", creatorEmail)
    await updateDoc(userRef, {
        templatesID: arrayRemove(templateID)
    })
    await deleteDoc(doc(templateCol, templateID))
}

async function getTemplates(creatorEmail: string) {
    const templateCol = collection(db, "templatesDB");
    const templateQuery = query(templateCol, where("creator", "==", creatorEmail))
    const snapshot = await getDocs(templateQuery)
    return snapshot.docs.map((doc): Template => {
        return {
            id: doc.id,
            title: doc.data().title,
            description: doc.data().description,
            image_url: doc.data().image_url,
            questions: doc.data().questions,
            creator: doc.data().creator,
            likes: doc.data().likes,
            createdAt: doc.data().createdAt,
        }
    })
}

async function getTemplate(tid: string): Promise<Template | undefined> {
    const templateRef = doc(db, "templatesDB", tid);
    const docSnap = await getDoc(templateRef);

    if (docSnap.exists()) {
        return {
            id: docSnap.id,
            title: docSnap.data().title,
            description: docSnap.data().description,
            image_url: docSnap.data().image_url,
            questions: docSnap.data().questions,
            creator: docSnap.data().creator,
            likes: docSnap.data().likes,
            createdAt: docSnap.data().createdAt,
        }
    }
}

async function setTemplate(data: Template): Promise<void> {
    setDoc(doc(db, "templatesDB", data.id), data)
}

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

export { searchTemplates, signUpUser, continueWithGoogle, signInWithPassword, addAdmin, getAdmins, deleteAdmin, createTemplate, getTemplates, getTemplate, deleteTemplate, setTemplate, submitForm }