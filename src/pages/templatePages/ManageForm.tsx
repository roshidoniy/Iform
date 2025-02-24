import {  useEffect, useState } from "react";
import { Question, Template } from "../../types/types";
import { useParams } from "react-router";
import { getTemplate, setTemplate } from "../../services/firebase-templates";
import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";

const ManageForm = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [formData, setFormData] = useState<Partial<Template>>();
    const [questions, setQuestions] = useState<Question[]>([]);

    const {tid} = useParams();
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        async function templateFetch() {
            setIsLoading(true);
            if (loading) return

            try {
                const template = await getTemplate(tid as string);
                if (template?.creator !== user?.email) {
                    return navigate(`/template/${tid}/view`);
                }
                if (template) {
                    setFormData(template);
                    setQuestions(template.questions);
                }
            } catch (error) {
                console.error("Error fetching template:", error);
            } finally {
                setIsLoading(false);
            }
        }
        templateFetch();
    }, [tid, loading]);

    if (isLoading || loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    const handleFormDataChange = (field: keyof Template, value: string | number) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const setTemplateHandler = async () => {
        await setTemplate({...formData, questions: questions} as Template);
        navigate(`/`);
    };

    const addQuestion = () => {
        const newQuestion: Question = {
            id: Date.now(),
            type: "TEXT", 
            question: "",
            options: []
        };
        setQuestions([...questions, newQuestion]);
    };

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
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-12 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Form</h1>
                <p className="text-gray-600">Design your form by adding questions and customizing settings</p>
                <div className="mt-4 flex justify-center gap-4">
                    <button
                        onClick={() => navigate(`/template/${tid}/view`)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        View Form
                    </button>
                    <button
                        onClick={() => navigate(`/template/${tid}/edit/results`)}
                        className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                        View Results
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Form Details</h2>
                <div className="space-y-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                            Form Title <span className="text-red-500">*</span>
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={formData?.title}
                            onChange={(e) => handleFormDataChange("title", e.target.value)}
                            placeholder="Enter a descriptive title"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                            Description
                        </label>
                        <textarea
                            id="description"
                            value={formData?.description}
                            onChange={(e) => handleFormDataChange("description", e.target.value)}
                            placeholder="Provide additional context about your form"
                            rows={3}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                            Cover Image URL
                        </label>
                        <input
                            id="image_url"
                            type="url"
                            value={formData?.image_url}
                            onChange={(e) => handleFormDataChange("image_url", e.target.value)}
                            placeholder="https://example.com/image.jpg"
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                        />
                        {formData?.image_url && (
                            <div className="mt-2 rounded-lg overflow-hidden border border-gray-200">
                                <img 
                                    src={formData.image_url} 
                                    alt="Form cover" 
                                    className="w-full h-40 object-cover"
                                    onError={(e) => {
                                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Questions Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-gray-900">Questions</h2>
                    <button
                        onClick={addQuestion}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                        </svg>
                        Add Question
                    </button>
                </div>

                <div className="space-y-6">
                    {questions.map((question, index) => (
                        <div key={question.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200 hover:border-blue-300 transition-all">
                            <div className="flex items-center mb-4">
                                <span className="text-sm font-medium text-gray-500 mr-4">Q{index + 1}</span>
                                <div className="flex-1 flex gap-4">
                                    <input
                                        type="text"
                                        value={question.question}
                                        onChange={(e) => updateQuestion(question.id, { question: e.target.value })}
                                        placeholder="Enter your question"
                                        className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                    <select
                                        value={question.type}
                                        onChange={(e) => updateQuestion(question.id, { type: e.target.value as Question['type'] })}
                                        className="px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white transition-all"
                                    >
                                        <option value="TEXT">Text</option>
                                        <option value="ONE_LINE">Single Line</option>
                                        <option value="CHECKBOX">Checkbox</option>
                                        <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                        <option value="DROPDOWN">Dropdown</option>
                                    </select>
                                </div>
                            </div>

                            {(question.type === "CHECKBOX" || question.type === "MULTIPLE_CHOICE" || question.type === "DROPDOWN") && (
                                <div className="ml-10 space-y-3">
                                    {question.options.map((option, optionIndex) => (
                                        <div key={optionIndex} className="flex items-center gap-2">
                                            <span className="text-sm font-medium text-gray-500 w-6">
                                                {optionIndex + 1}.
                                            </span>
                                            <input
                                                type="text"
                                                value={option}
                                                onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                                                placeholder="Option text"
                                                className="flex-1 px-3 py-1.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                            />
                                            <button
                                                onClick={() => removeOption(question.id, optionIndex)}
                                                className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        onClick={() => addOption(question.id)}
                                        className="ml-6 inline-flex items-center text-sm text-blue-600 hover:text-blue-700 focus:outline-none transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                        </svg>
                                        Add Option
                                    </button>
                                </div>
                            )}

                            <div className="mt-4 ml-10">
                                <button
                                    onClick={() => removeQuestion(question.id)}
                                    className="inline-flex items-center text-sm text-red-500 hover:text-red-700 focus:outline-none transition-colors"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                    </svg>
                                    Delete Question
                                </button>
                            </div>
                        </div>
                    ))}

                    {questions.length === 0 && (
                        <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No questions</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating a new question</p>
                            <div className="mt-6">
                                <button
                                    onClick={addQuestion}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    New Question
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {questions.length > 0 && (
                <div className="mt-8 flex justify-end">
                    <button
                        onClick={setTemplateHandler}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        Save Form
                    </button>
                </div>
            )}
        </div>
    );
};

export default ManageForm;