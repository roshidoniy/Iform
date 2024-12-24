import { useState } from 'react';
import { getAuth } from 'firebase/auth';

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

function AccountSettings() {
    return (
        <div className="bg-white p-8 rounded-lg shadow">
            <h3 className="text-lg font-medium text-gray-900 mb-6">Account Settings</h3>
            {/* Account content will go here */}
        </div>
    );
}

export default function Settings() {
    const [activeTab, setActiveTab] = useState<'profile' | 'account'>('profile');

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
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Profile
                        </button>
                        <button
                            onClick={() => setActiveTab('account')}
                            className={`${
                                activeTab === 'account'
                                    ? 'border-indigo-500 text-indigo-600'
                                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                            } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                        >
                            Account
                        </button>
                    </nav>
                </div>

                <div>
                    {activeTab === 'profile' ? (
                        <ProfileSettings />
                    ) : (
                        <AccountSettings />
                    )}
                </div>
            </div>
        </div>
    );
} 