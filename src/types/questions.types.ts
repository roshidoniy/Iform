export interface Option {
    id: number;
    text: string;
}

export interface Question {
    id: number;
    type: "TEXT" | "ONE_LINE" | "MULTIPLE_CHOICE" | "DATE" | "NUMBER";
    question: string;
    required: boolean;
    options?: Option[];
}