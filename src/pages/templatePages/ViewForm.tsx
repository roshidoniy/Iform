import { useEffect, useState } from "react";
import { Template } from "../../types/types";
import { useParams, Link } from "react-router";
import { getTemplate } from "../../services/firebase-service";
import { useAuth } from "../../context/AuthContext";

const ViewForm = () => {
    const [template, setTemplate] = useState<Template | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");
    const { tid } = useParams();
    const { user } = useAuth();
    const [answers, setAnswers] = useState<Record<number, string | string[]>>({});

    useEffect(() => {
        async function fetchTemplate() {
            if (!tid) return;
            setIsLoading(true);
            try {
                const templateData = await getTemplate(tid);
                if (templateData) {
                    setTemplate(templateData);
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

    useEffect(() => {
        console.log(answers)
    }, [answers])

    const handleAnswerChange = (questionId: number, value: string | string[]) => {
        if (!user) return;
        setAnswers(prev => ({
            ...prev,
            [questionId]: value
        }));
    };

    const handleCheckboxChange = (questionId: number, option: string, checked: boolean) => {
        if (!user) return;
        const currentAnswers = answers[questionId] as string[] || [];
        let newAnswers: string[];
        
        if (checked) {
            newAnswers = [...currentAnswers, option];
        } else {
            newAnswers = currentAnswers.filter(item => item !== option);
        }

        handleAnswerChange(questionId, newAnswers);
    };

    const handleSubmit = () => {
        if (!user) return;
        console.log("Submitting answers:", answers);
        // Add submission logic here
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Error</h2>
                    <p className="text-gray-600">{error}</p>
                </div>
            </div>
        );
    }

    if (!template) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Not Found</h2>
                    <p className="text-gray-600">The requested template could not be found.</p>
                </div>
            </div>
        );
    }

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

            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{template.title}</h1>
                {template.description && (
                    <p className="text-gray-600">{template.description}</p>
                )}
                {template.image_url && (
                    <img 
                        src={template.image_url} 
                        alt="Form cover" 
                        className="mt-4 w-full h-48 object-cover rounded-lg"
                    />
                )}
            </div>

            {/* Questions */}
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

                        {/* Answer Input based on question type */}
                        {question.type === "TEXT" && (
                            <textarea
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                                placeholder="Your answer"
                                disabled={!user}
                                value={answers[question.id] as string || ""}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                            />
                        )}

                        {question.type === "ONE_LINE" && (
                            <input
                                type="text"
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Your answer"
                                disabled={!user}
                                value={answers[question.id] as string || ""}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
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
                                            checked={(answers[question.id] as string[] || []).includes(option)}
                                            onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
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
                                            checked={answers[question.id] === option}
                                            onChange={() => handleAnswerChange(question.id, option)}
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
                                value={answers[question.id] as string || ""}
                                onChange={(e) => handleAnswerChange(question.id, e.target.value)}
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

            {/* Submit Button */}
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