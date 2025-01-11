import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { FormData, Template } from "../../types/types";
import { getTemplate } from "../../services/firebase-templates";
import { useAuth } from "../../context/AuthContext";

const Results = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [template, setTemplate] = useState<Template>();
    const [submissions, setSubmissions] = useState<FormData[]>([]);
    const { tid } = useParams();
    const navigate = useNavigate();
    const { user, loading } = useAuth();

    useEffect(() => {
        async function fetchData() {
            setIsLoading(true);
            if (loading) return;

            try {
                const templateData = await getTemplate(tid as string);
                if (!templateData) {
                    navigate("/");
                    return;
                }

                if (templateData.creator !== user?.email) {
                    navigate(`/template/${tid}/view`);
                    return;
                }
                setTemplate(templateData);
                setSubmissions(templateData.answers || []);
            } catch (error) {
                console.error("Error fetching template:", error);
                navigate("/");
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [tid, loading, user]);

    if (isLoading || loading) {
        return (
            <div className="max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
        );
    }

    if (!template) {
        return null;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{template.title} - Results</h1>
                <p className="text-gray-600">View all form submissions</p>
            </div>

            {submissions.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h3 className="mt-2 text-sm font-medium text-gray-900">No submissions yet</h3>
                    <p className="mt-1 text-sm text-gray-500">Wait for users to submit their responses.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {submissions.map((submission, index) => (
                        <div key={submission.createdAt.toMillis()} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-medium text-gray-900">
                                        Submission #{index + 1}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        By: {submission.authorEmail}
                                    </p>
                                </div>
                                <span className="text-sm text-gray-500">
                                    {submission.createdAt.toDate().toLocaleDateString()}
                                </span>
                            </div>

                            <div className="space-y-4">
                                {submission.answer.map((answer) => (
                                    <div key={answer.questionId} className="border-t border-gray-100 pt-4">
                                        <p className="text-sm font-medium text-gray-700 mb-1">
                                            {answer.question}
                                        </p>
                                        <div className="text-sm text-gray-900">
                                            {Array.isArray(answer.answer) ? (
                                                <ul className="list-disc list-inside">
                                                    {answer.answer.map((item, i) => (
                                                        <li key={i}>{item}</li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p>{answer.answer}</p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Results; 