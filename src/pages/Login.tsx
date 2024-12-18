import React, { useState } from 'react';
import { signUpUser, signInWithGoogle } from '../services/firebase-service';


const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await signUpUser(email, password);
            setError('');
            alert('User signed up successfully');
        }
        catch (error) {
            setError('Error signing up');
            console.error('Error signing up:', error);
        }

        
    };

    const signInWithGoogleHandler = async () => {
        try {
            const user = await signInWithGoogle();
            console.log('User signed in with Google:', user);
            alert('User signed in with Google');
        } catch (error) {
            console.error('Error signing in with Google:', error);
        }
    };
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 w-full">
            <h1 className="text-2xl font-bold mb-4">Sign Up</h1>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded-md shadow-md w-full max-w-sm">
                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                </div>
                <div className="mb-4 relative">
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring focus:ring-blue-500"
                    />
                    <button
                        type="button"
                        className="absolute top-1/2 right-3 mt-3 transform -translate-y-1/2"
                        onClick={togglePasswordVisibility}
                    >
                        {showPassword ? 'Hide' : 'Show'}
                    </button>
                </div>
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {/* Auth buttons container */}
                <div className="flex flex-col items-center mt-4">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring focus:ring-blue-500"
                    >
                        Sign Up
                    </button>
                    <button
                        type="button"
                        className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring focus:ring-green-500 mt-2"
                        onClick={signInWithGoogleHandler}
                    >
                        Sign In with Google
                    </button>
                </div>
                    

            </form>
        </div>
    )
}

export default Login