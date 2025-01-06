import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router";
import { searchTemplates } from "../services/firebase-service";
import { Template } from "../types/types";

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [searchResults, setSearchResults] = useState<Template[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string>("");

    useEffect(() => {
        async function getSearchResult() {
            setIsLoading(true);
            setError("");
            try {
                const query = searchParams.get("q");
                if (!query) {
                    setSearchResults([]);
                    return;
                }
                const results = await searchTemplates(query);
                setSearchResults(results as Template[]);

            } catch (error) {
                setError("Failed to fetch search results");
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        getSearchResult();
    }, [searchParams]);

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

    if (searchResults.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">No Results Found</h2>
                    <p className="text-gray-600">Try different search terms</p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                Search Results for "{searchParams.get("q")}"
            </h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {searchResults.map((template) => (
                    <Link 
                        key={template?.id} 
                        to={`/template/${template?.id}`}
                        className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
                    >
                        <div className="p-6">
                            {template?.image_url && (
                                <img 
                                    src={template.image_url} 
                                    alt={template.title}
                                    className="w-full h-48 object-cover rounded-lg mb-4"
                                />
                            )}
                            <h2 className="text-xl font-semibold text-gray-900 mb-2">
                                {template.title}
                            </h2>
                            {template.description && (
                                <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                    {template.description}
                                </p>
                            )}
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default SearchResults;