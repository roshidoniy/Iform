import {  useEffect, useState } from "react";
import { Question } from "../types/types";

const QuestionForm = () => {
    const [questions, setQuestions] = useState<Question[]>([]);

    const addQuestion = () => {
        const newQuestion: Question = {
            id: Date.now(),
            type: "TEXT", 
            question: "",
            options: []
        };
        setQuestions([...questions, newQuestion]);
    };

    useEffect(() => {        
        console.log(questions)
    }, [questions])

    const removeQuestion = (id: number) => {
        setQuestions(questions.filter(q => q.id !== id));
    };

    const updateQuestion = (id: number, updates: Partial<Question>) => {
        setQuestions(questions.map(q => 
            q.id === id ? { ...q, ...updates } : q
        ));
    };

    const addOption = (questionId: number) => {
        setQuestions(questions.map(q => 
            q.id === questionId
                ? { ...q, options: [...q.options, ""] }
                : q
        ));
    };

    const updateOption = (questionId: number, optionIndex: number, newValue: string) => {
        setQuestions(questions.map(q => {
            if (q.id === questionId) {
                const newOptions = [...q.options];
                newOptions[optionIndex] = newValue;
                return { ...q, options: newOptions };
            }
            return q;
        }));
    };

    const removeOption = (questionId: number, optionIndex: number) => {
        setQuestions(questions.map(q => 
            q.id === questionId 
                ? { ...q, options: q.options.filter((_, index) => index !== optionIndex) }
                : q
        ));
    };

    return (
        <div className="max-w-full mx-auto p-6 min-w-80">
            <div className="flex justify-between items-center mb-8 w-full">
                <h1 className="text-2xl font-bold">Create Form</h1>
                <button
                    onClick={addQuestion}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                    +
                </button>
            </div>

            <div className="space-y-6">
                {questions.map((question) => (
                    <div key={question.id} className="p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="flex">
                            <div className="mr-4">
                                <input
                                    type="text"
                                    value={question.question}
                                    onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                                    placeholder="Enter your question"
                                    className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                                />
                            </div>
                            <select
                                value={question.type}
                                onChange={(e) => updateQuestion(question.id, { type: e.target.value as Question['type'] })}
                                className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500 bg-white"
                            >
                                    <option key={1} value="TEXT">
                                        Text
                                    </option>
                                    <option key={2} value="NUMBER">
                                        Number
                                    </option>
                                    <option key={3} value="ONE-LINE">
                                        One line
                                    </option>
                                    <option key={4} value="MULTIPLE_CHOICE">
                                        Multiple Choice
                                    </option>
                                    <option key={5} value="DATE">
                                        Date
                                    </option>
                            </select>
                        </div>

                        {(question.type === "ONE_LINE" || question.type === "MULTIPLE_CHOICE") && (
                            <div className="ml-4 space-y-2 mt-4">
                                {question.options.map((option, optionIndex) => (
                                    <div key={optionIndex} className="flex items-center space-x-2">
                                        <input
                                            type="text"
                                            value={option}
                                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                            placeholder="Option text"
                                            className="flex-1 px-3 py-1 rounded border border-gray-300 focus:outline-none focus:border-blue-500"
                                        />
                                        <button
                                            onClick={() => removeOption(question.id, optionIndex)}
                                            className="p-1 text-red-600 hover:text-red-800"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                                <button
                                    onClick={() => addOption(question.id)}
                                    className="mt-2 text-sm text-blue-600 hover:text-blue-800"
                                >
                                    + Add Option
                                </button>
                            </div>
                        )}

                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={() => removeQuestion(question.id)}
                                className="text-red-600 hover:text-red-800"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {questions.length > 0 && (
                <div className="mt-8 flex justify-end">
                    <button
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Save Form
                    </button>
                </div>
            )}
        </div>
    );
};

export default QuestionForm;