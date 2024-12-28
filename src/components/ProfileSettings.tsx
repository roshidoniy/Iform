import { getAuth } from 'firebase/auth';

export default function ProfileSettings() {
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