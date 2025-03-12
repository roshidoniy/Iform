import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createTemplate, deleteTemplate, getTemplates } from "../services/firebase-templates";
import { useNavigate } from "react-router";
import type { Template } from "../types/types";
import { ToastContainer } from "react-toastify";

const Home = () => {
    const [isCreating, setIsCreating] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const { user } = useAuth();
    const [templates, setTemplates] = useState<Template[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchTemplates = async () => {
            if (!user?.email) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);
            try {
                const templates = await getTemplates(user.email);
                setTemplates(templates);
            } catch (error) {
                console.error("Error fetching templates:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTemplates();
    }, [user?.email]);

    const createTemplateHandler = async () => {
        setIsCreating(true);
        if (!user?.email) {
            setIsCreating(false);
            return;
        }
        const id = await createTemplate(user.email);
        setIsCreating(false);
        navigate(`/template/${id}/edit`);
    };

    const deleteTemplateHandler = async (templateID: string) => {
        await deleteTemplate(user?.email as string, templateID);
        setTemplates(templates.filter((template) => template.id !== templateID));
    };

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <ToastContainer />
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Templates</h1>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    onClick={createTemplateHandler}
                    disabled={isCreating || !user}
                >
                    {isCreating ? (
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    )}
                    New Template
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : templates.length === 0 ? (
                <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Templates Yet</h3>
                    <p className="text-gray-500">Create your first template to get started</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {templates.map((template) => (
                        <div
                            key={template.id}
                            className="bg-white rounded-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 ease-in-out relative group"
                        >
                            <div
                                className="p-6 py-10 cursor-pointer"
                                onClick={() => navigate(`/template/${template.id}/edit`)}
                            >
                                {template.image_url && (
                                    <div className="rounded-lg overflow-hidden mb-4 shadow-sm">
                                        <img
                                            src={template.image_url}
                                            alt={template.title}
                                            className="w-full h-48 object-cover hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                )}
                                <h2 className="text-xl font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                                    {template.title}
                                </h2>
                                {template.description && (
                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                        {template.description}
                                    </p>
                                )}
                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                                        </svg>
                                        {template.questions.length} questions
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                                        </svg>
                                        {template.likes} likes
                                    </span>
                                </div>
                            </div>

                            {/* Action buttons */}
                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        deleteTemplateHandler(template.id);
                                    }}
                                    className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300"
                                    title="Delete template"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Home;