import { useState } from 'react';
import { getAuth } from 'firebase/auth';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../context/AuthContext';

export default function Header() {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { user, loading } = useAuth();
    const auth = getAuth();
    const navigate = useNavigate();

    const handleSignOut = async () => {
        try {
            await auth.signOut();
            navigate('/login');
        } catch (error) {
            console.error('Error signing out:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        navigate(`/search?q=${searchQuery}`);
    };

    return (
        <header className="border-b bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link to="/" className="flex-shrink-0">
                        <img
                            className="h-8 w-auto"
                            src="/Iform_Black.webp"
                            alt="Logo"
                        />
                    </Link>

                    <div className="flex-1 max-w-lg mx-4">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:border-blue-500"
                            />
                            <button 
                                type="submit" 
                                className="absolute right-0 top-0 h-full px-4 text-gray-500 hover:text-gray-700"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
                                </svg>
                            </button>
                        </form>
                    </div>

                    {loading ? (
                        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                    ) : user ? (
                        <div className="relative">
                            <button
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="flex items-center focus:outline-none"
                            >
                                {user.photoURL ? (
                                    <img
                                        className="h-8 w-8 rounded-full object-cover"
                                        src={user.photoURL}
                                        alt="User avatar"
                                    />
                                ) : (
                                    <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
                                        <span className="text-white text-sm">
                                            {user.email?.charAt(0).toUpperCase() || 'U'}
                                        </span>
                                    </div>
                                )}
                            </button>
                            
                            <div className={`${isDropdownOpen ? 'block' : 'hidden'} absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5`}>
                                <div className="py-1">
                                    <div className="px-4 py-2 text-sm">
                                        <p className="font-medium">{user.displayName || 'User'}</p>
                                        <p className="text-gray-500 text-xs">{user.email}</p>
                                    </div>
                                    <hr />
                                    <button
                                        onClick={() => {
                                            navigate('/settings');
                                            setIsDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Settings
                                    </button>
                                    <hr />
                                    <button
                                        onClick={() => {
                                            handleSignOut();
                                            setIsDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                    >
                                        Sign out
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-4">
                            <Link
                                to="/login"
                                className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium rounded-lg transition-colors"
                            >
                                Log in
                            </Link>
                            <Link
                                to="/signup"
                                className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Sign up
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
} 