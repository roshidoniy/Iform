import { Timestamp } from "firebase/firestore";

export interface User {
    email: string;
    password: string;
}

// export interface UserData {
//     email: string;
//     templatesID: string[];
//     admins: string[];
//     author_admin: string[];
//     liked: string[];
//     commented: string[];
// }

export interface Template {
    id: string;
    title: string;
    creator: string;
    description: string;
    image_url: string;
    questions: Question[];
    likes: number;
    createdAt: Timestamp;
}

export interface Question {
    id: number;
    type: "ONE_LINE" | "TEXT" | "CHECKBOX" | "MULTIPLE_CHOICE" | "DROPDOWN";
    question: string;
    options: string[]
}

export interface FormAnswer {
    questionId: number;
    question: string;
    answer: string | string[];
}