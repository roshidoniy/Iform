import { useRef, useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';
import { addAdmin, deleteAdmin } from '../services/firebase-service';
import { getFirestore, doc, onSnapshot } from 'firebase/firestore';

export default function AdminManagement() {
    const auth = getAuth();
    const db = getFirestore();
    const emailRef = useRef<HTMLInputElement>(null);
    const [error, setError] = useState<string>('');
    const [admins, setAdmins] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        let unsubscribe: () => void;

        if (auth.currentUser?.email) {
            const userRef = doc(db, 'usersDB', auth.currentUser.email);
            unsubscribe = onSnapshot(userRef, 
                (doc) => {
                    if (doc.exists()) {
                        const userData = doc.data();
                        setAdmins(userData.admins || []);
                    }
                    setIsLoading(false);
                },
                (error) => {
                    console.error("Error fetching admins:", error);
                    setError(error.message);
                    setIsLoading(false);
                }
            );
        }

        return () => {
            if (unsubscribe) {
                unsubscribe();
            }
        };
    }, [auth.currentUser?.email, db]);

    const addAdminHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (!emailRef.current?.value) {
                setError('Please enter an email address');
                return;
            }
            await addAdmin(auth.currentUser?.email as string, emailRef.current.value);
            emailRef.current.value = '';
            setError('');
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        }
    }

    const handleDeleteAdmin = async (email: string) => {
        try {
            setIsLoading(true);
            await deleteAdmin(auth.currentUser?.email as string, email);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            }
        } finally {
            setIsLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div className="bg-white p-8 rounded-lg shadow">
                <div className="text-center text-gray-500">Loading admins...</div>
            </div>
        );
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
                    
                    {admins.length > 0 ? (
                        <div className="overflow-hidden border border-gray-200 rounded-lg">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                            Email
                                        </th>
                                        <th scope="col" className="relative px-6 py-3">
                                            <span className="sr-only">Actions</span>
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {admins.map((adminEmail, index) => (
                                        <tr key={index} className="hover:bg-gray-50">
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                {adminEmail}
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                                                <button
                                                    onClick={() => handleDeleteAdmin(adminEmail)}
                                                    className="text-red-600 hover:text-red-800 font-medium"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <div className="text-center py-4 text-gray-500">
                            No admins found
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
} 