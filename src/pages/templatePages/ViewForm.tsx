import { useEffect, useState, useRef } from "react";
import type { Template, AnswerOfQuestion } from "../../types/types";
import { useParams, Link } from "react-router";
import { getTemplate, submitForm } from "../../services/firebase-service";
import { useAuth } from "../../context/AuthContext";

const ViewForm = () => {
    const [template, setTemplate] = useState<Template | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const { tid } = useParams();
    const { user } = useAuth();
    const answerRef = useRef<AnswerOfQuestion[]>([]);

    useEffect(() => {
        async function fetchTemplate() {
            if (!tid) return;
            setIsLoading(true);
            try {
                const templateData = await getTemplate(tid);
                if (templateData) {
                    setTemplate(templateData);
                    templateData.questions.forEach((q) => {
                        answerRef.current.push({questionId: q.id, question: q.question, answer: "" })
                    })
                } else {
                    setError("Template not found");
                }
            } catch (error) {
                setError("Failed to load template");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }
        fetchTemplate();
    }, [tid]);

    const handleAnswerChange = (questionId: number, question: string, value: string | string[]) => {
        if (!user) return;
        
        const existingAnswerIndex = answerRef.current.findIndex(a => a.questionId === questionId);
        const newAnswer = { questionId, question, answer: value };
        
        answerRef.current[existingAnswerIndex] = newAnswer;
    }

    const handleCheckboxChange = (questionId: number, question: string, option: string, checked: boolean) => {
        if (!user) return;
        
        const existingAnswer = answerRef.current.find(a => a.questionId === questionId);
        const currentValues = (existingAnswer?.answer as string[]) || [];
        
        let newValues: string[];
        if (checked) {
            newValues = [...currentValues, option];
        } else {
            newValues = currentValues.filter(v => v !== option);
        }

        handleAnswerChange(questionId, question, newValues);
    };

    const handleSubmit = async () => {
        if (!user) return;
        answerRef.current.forEach((answer) => {
            if (answer.answer.length === 0) {
                setError("Please fill in all the required fields");
                return;
            }

        });
        await submitForm({templateID: tid as string, authorEmail: user?.email as string, answer: answerRef.current});
    };

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                <p className="text-gray-600">{error}</p>
            </div>
        </div>
    );

    if (!template) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h2>
                <p className="text-gray-600">The requested template could not be found.</p>
            </div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            {!user && (
                <div className="mb-6 bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <div className="flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                        <p className="text-blue-700">
                            Please <Link to="/login" className="font-medium underline">log in</Link> to fill out this form.
                        </p>
                    </div>
                </div>
            )}
    
            <div className="mb-8">
                {template.image_url && (
                    <img 
                        src={template.image_url} 
                        alt="Form cover" 
                        className="mt-4 w-full h-48 object-cover object-center rounded-xl"
                    />
                )}
                <h1 className="text-5xl text-center font-bold text-gray-900 my-3">{template.title}</h1>
                {template.description && (
                    <p className="text-gray-600">{template.description}</p>
                )}
                
            </div>

            <div className="space-y-6">
                {template.questions.map((question, index) => (
                    <div key={question.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                        <div className="mb-4">
                            <span className="text-sm font-medium text-gray-500 mr-2">
                                {index + 1}.
                            </span>
                            <span className="text-lg font-medium text-gray-900">
                                {question.question}
                            </span>
                        </div>

                        {question.type === "TEXT" && (
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Your answer"
                                disabled={!user}
                                onChange={(e) => handleAnswerChange(question.id, question.question, e.target.value)}
                            />
                        )}

                        {question.type === "ONE_LINE" && (
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your answer"
                                disabled={!user}
                                onChange={(e) => handleAnswerChange(question.id, question.question, e.target.value)}
                            />
                        )}

                        {question.type === "CHECKBOX" && (
                            <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                    <label key={optionIndex} className="flex items-center space-x-3">
                                        <input 
                                            type="checkbox" 
                                            className="form-checkbox h-5 w-5 text-blue-600"
                                            disabled={!user}
                                            onChange={(e) => handleCheckboxChange(question.id, question.question, option, e.target.checked)}
                                        />
                                        <span className="text-gray-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {question.type === "MULTIPLE_CHOICE" && (
                            <div className="space-y-2">
                                {question.options.map((option, optionIndex) => (
                                    <label key={optionIndex} className="flex items-center space-x-3">
                                        <input 
                                            type="radio" 
                                            name={`question-${question.id}`}
                                            className="form-radio h-5 w-5 text-blue-600"
                                            disabled={!user}
                                            onChange={() => handleAnswerChange(question.id, question.question, option)}
                                        />
                                        <span className="text-gray-700">{option}</span>
                                    </label>
                                ))}
                            </div>
                        )}

                        {question.type === "DROPDOWN" && (
                            <select 
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                disabled={!user}
                                onChange={(e) => handleAnswerChange(question.id, question.question, e.target.value)}
                            >
                                <option value="">Select an option</option>
                                {question.options.map((option, optionIndex) => (
                                    <option key={optionIndex} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                ))}
            </div>

            <div className="mt-8 flex justify-end">
                {user ? (
                    <button 
                        onClick={handleSubmit}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                    >
                        Submit
                    </button>
                ) : (
                    <Link 
                        to="/login" 
                        className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                    >
                        Log in to submit
                    </Link>
                )}
            </div>
        </div>
    );
};

export default ViewForm;