import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { createTemplate, deleteTemplate, getTemplates } from "../services/firebase-service";
import { useNavigate } from "react-router";
import { Template } from "../types/types";
const Home = () => {
    const [isCreating, setIsCreating] = useState(false);
    const {user} = useAuth();
    const [templates, setTemplates] = useState<Template[]>([]);
    
    const navigate = useNavigate()

    const createTemplateHandler = async () => {
        setIsCreating(true)
        if(!user?.email){
            setIsCreating(false)
            return
        }
        const id = await createTemplate(user?.email)
        setIsCreating(false)
        navigate(`/template/${id}/edit`)
    }

    const deleteTemplateHandler = async (templateID: string) => {
        if(!user?.email){
            return
        }
        await deleteTemplate(user?.email, templateID)
        setTemplates(templates.filter(template => template.id !== templateID))
    }

    const goToEditForm = (tid: string) => {
        navigate(`/template/${tid}/edit`);
    };

    
    useEffect(() => {
        const fetchTemplates = async () => {
            if(!user?.email){
                return
            }
            const templates = await getTemplates(user?.email)
            setTemplates(templates)
        }
        fetchTemplates()
    }, [user?.email])

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Templates</h1>
                <button
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                    onClick={createTemplateHandler}
                    disabled={isCreating}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                    Create New Template
                </button>
            </div>

            <div className="bg-white shadow-sm rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Title
                            </th>
                            <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 w-full">
                        {templates.map((template, index) => (
                            <tr key={index} className="hover:bg-gray-50 w-full" >
                                <td className="px-6 py-4 whitespace-nowrap hover:underline cursor-pointer" onClick={() => goToEditForm(template.id as string)}>
                                    <div className="text-sm font-medium text-gray-900">{template.title}</div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-blue-600 hover:text-blue-900 mr-4" onClick={() => goToEditForm(template.id as string)}>Edit</button>
                                    <button className="text-red-600 hover:text-red-900" onClick={() => deleteTemplateHandler(template.id as string)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Home