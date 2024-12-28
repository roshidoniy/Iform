import { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { Link } from 'react-router';
import AdminManagement from '../components/AdminManagement';
import ProfileSettings from '../components/ProfileSettings';

export default function Settings() {
    const [activeTab, setActiveTab] = useState<'profile' | 'admins'>('profile');
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setIsAuthenticated(!!user);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, [auth]);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-gray-600">Loading...</div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900">Please Login</h2>
                    <p className="mt-2 text-gray-600">You need to be logged in to access settings.</p>
                    <div className="mt-6">
                        <Link
                            to="/login"
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Go to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
                    Settings
                </h2>

                <div className="border-b border-gray-200 mb-8">
                    <nav className="-mb-px flex space-x-8" aria-label="Tabs">
                        <button
                            onClick={() => setActiveTab('profile')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm rounded-none outline-none focus:outline-none ${
                                activeTab === 'profile'
                                    ? 'border-b-indigo-500 rounded-none text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('admins')}
                            className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm rounded-none outline-none focus:outline-none ${
                                activeTab === 'admins'
                                    ? 'border-b-indigo-500 rounded-none text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Admins
                        </button>
                    </nav>
                </div>

                    {activeTab === 'profile' && <ProfileSettings />}
                    {activeTab === 'admins' && <AdminManagement />}
            </div>
        </div>
    );
} 