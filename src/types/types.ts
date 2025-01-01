import { Timestamp } from "firebase/firestore";

export interface User {
    email: string;
    password: string;
}

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
    type: "TEXT" | "ONE_LINE" | "MULTIPLE_CHOICE" | "DATE" | "NUMBER";
    question: string;
    options: string[]
}