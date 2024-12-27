import { useRef, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { addAdmin } from '../services/firebase-service';
import { Link } from 'react-router';

function ProfileSettings() {
    const auth = getAuth();
    const user = auth.currentUser;

    return (
        <div className="bg-white p-8 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Profile Information</h3>
            
            <div className="space-y-6">
                <div>
                    <p className="text-sm font-medium text-gray-500">Display Name</p>
                    <p className="mt-1 text-sm text-gray-900">{user?.displayName || 'Not set'}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="mt-1 text-sm text-gray-900">{user?.email}</p>
                </div>

                <div>
                    <p className="text-sm font-medium text-gray-500">Account Created</p>
                    <p className="mt-1 text-sm text-gray-900">
                        {user?.metadata.creationTime ? new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                    </p>
                </div>
            </div>
        </div>
    );
}


function AdminManagement() {
    const auth = getAuth();
    const emailRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>('');

    const addAdminHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!emailRef.current?.value) {
                setError('Please enter an email address');
                return;
            }
            await addAdmin(auth.currentUser?.email as string, emailRef.current.value);
            emailRef.current.value = ''; // Clear input after successful addition
            setError('');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Admin Management</h3>
            <div className="space-y-6">
                {error && (
                    <div className="text-red-600 text-sm">{error}</div>
                )}
                <form className="flex gap-4" onSubmit={addAdminHandler}>
                    <input
                        type="email"
                        ref={emailRef}
                        placeholder="Enter admin email"
                        className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button 
                    type='submit'
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" 
                        
                    >
                        Add Admin
                    </button>
                </form>

                <div className="border-t pt-6">
                    <h4 className="text-sm font-medium text-gray-500 mb-4">Current Admins</h4>
                    <div className="space-y-2">
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function Settings() {
    const [activeTab, setActiveTab] = useState<'profile' | 'admin'>('profile');
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
                            className={`${
                                activeTab === 'profile'
                                    ? 'border-b-indigo-500 rounded-none text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('admin')}
                            className={`${
                                activeTab === 'admin'
                                    ? 'border-b-indigo-500 rounded-none text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Admin
                        </button>
                    </nav>
                </div>

                <div>
                    {activeTab === 'profile' && <ProfileSettings />}
                    {activeTab === 'admin' && <AdminManagement />}
                </div>
            </div>
        </div>
    );
} 