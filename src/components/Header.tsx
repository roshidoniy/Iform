import { useEffect, useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Link, useNavigate } from 'react-router';

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const auth = getAuth();
    const navigate = useNavigate();
    const user = auth.currentUser;

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };
    useEffect(() => {
        console.log(user);
        
    }, [user]);
    

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Searching for:', searchQuery);
    };

    return (
        <header className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/">
                        <img
                            className="h-8 w-auto"
                            src="/Iform_black.png"
                            alt="Logo"
                        />
                    </Link>

                    <div className="flex-1 max-w-lg mx-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                className="w-full rounded-lg border border-gray-300 pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="absolute right-0 top-0 mt-2 mr-3 text-gray-400 hover:text-gray-600"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    <div className="relative">
                        <button
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="flex items-center focus:outline-none"
                        >
                            {user?.photoURL ? (
                                <img
                                    className="h-8 w-8 rounded-full object-cover"
                                    src={user.photoURL}
                                    alt="User avatar"
                                />
                            ) : (
                                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                                    <span className="text-white text-sm">
                                        {user?.email?.charAt(0).toUpperCase() || 'U'}
                                    </span>
                                </div>
                            )}
                        </button>

                        {isDropdownOpen && (
                            <div className="absolute right-0 mt-2 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                                <div className="py-1" role="menu">
                                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                                        {user?.email}
                                    </div>
                                    <button
                                        onClick={() => {
                                            navigate('/settings');
                                            setIsDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                        role="menuitem"
                                    >
                                        Settings
                                    </button>
                                    <button
                                        onClick={handleSignOut}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 border-t"
                                        role="menuitem"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
} 