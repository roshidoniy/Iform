import type { Template, FormData } from "../types/types";
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove, getDocs, deleteDoc, increment, query, where, serverTimestamp, Timestamp } from "firebase/firestore";
import { db } from "./firebase-users";

async function submitForm(formData: Partial<FormData>): Promise<void> {
    const templateRef = doc(db, "templatesDB", formData.templateID!);
    const userRef = doc(db, "usersDB", formData.authorEmail!);

    await updateDoc(templateRef, {
        answers: arrayUnion({authorEmail: formData.authorEmail, createdAt: serverTimestamp(), answer: formData.answer})
    })

    await updateDoc(userRef, {
        answered: arrayUnion({ authorEmail: formData.authorEmail, createdAt: serverTimestamp(), answer: formData.answer })
    })
}

async function searchTemplates(searchQuery: string): Promise<Partial<Template>[]> {
    if(!searchQuery) return []

    const templateCol = collection(db, "templatesDB");
    const templateDoc = await getDocs(templateCol);
    const searchResults: Partial<Template>[] = [];

    if(templateDoc.empty) return []

    templateDoc.docs.forEach((doc) => {
        if(
            doc.data().title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            doc.data().description.toLowerCase().includes(searchQuery.toLowerCase())
        ){
            searchResults.push({
                id: doc.id,
                title: doc.data().title,
                description: doc.data().description,
                image_url: doc.data().image_url,
            })
        }
    })
    return searchResults
}

async function createTemplate(creatorEmail: string): Promise<string> {
    const userRef = doc(db, "usersDB", creatorEmail)

    const templateInitialData = {
        title: "New Template",
        creator: creatorEmail,
        description: "",
        image_url: "",
        questions: [],
        comments: [],
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
            comments: doc.data().comments,
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
            comments: docSnap.data().comments,
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

async function likeTemplate(templateId: string, userEmail: string): Promise<void> {
    const templateRef = doc(db, "templatesDB", templateId);
    const userRef = doc(db, "usersDB", userEmail);

    await updateDoc(templateRef, {
        likes: increment(1)
    });

    await updateDoc(userRef, {
        liked: arrayUnion(templateId)
    });
}

async function unlikeTemplate(templateId: string, userEmail: string): Promise<void> {
    const templateRef = doc(db, "templatesDB", templateId);
    const userRef = doc(db, "usersDB", userEmail);

    await updateDoc(templateRef, {
        likes: increment(-1)
    });

    await updateDoc(userRef, {
        liked: arrayRemove(templateId)
    });
}

async function hasUserLiked(templateId: string, userEmail: string): Promise<boolean> {
    const userRef = doc(db, "usersDB", userEmail);
    const userDoc = await getDoc(userRef);
    const userData = userDoc.data();
    return userData?.liked?.includes(templateId) || false;
}

async function submitComment({templateID, authorEmail, comment_text}: {templateID: string, authorEmail: string, comment_text: string}): Promise<void> {
    const templateRef = doc(db, "templatesDB", templateID);
    const userRef = doc(db, "usersDB", authorEmail);

    await updateDoc(templateRef, {
        comments: arrayUnion({authorEmail: authorEmail, createdAt: Timestamp.now(), comment_text: comment_text})
    })

    await updateDoc(userRef, {
        commented: arrayUnion(templateID)
    })
}

export { 
    searchTemplates, 
    createTemplate, 
    getTemplates, 
    getTemplate, 
    deleteTemplate, 
    setTemplate, 
    submitForm, 
    likeTemplate, 
    unlikeTemplate, 
    hasUserLiked, 
    submitComment 
}; 