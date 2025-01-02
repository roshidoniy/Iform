import { createContext, useContext, useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { UserData } from '../types/types';
import { getUserData } from '../services/firebase-service';
const AuthContext = createContext<{
    user: User | null;
    loading: boolean;
    userData: UserData | null;
}>({
    user: null,
    loading: true,
    userData: null
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [userData, setUserData] = useState<UserData | null>(null);
    const auth = getAuth();

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            setUser(user);
            await getUserData(user?.email as string)
                .then((userData) => {
                    if (userData) {
                        setUserData(userData);
                    }
                })
            setLoading(false);
        });



        return () => unsubscribe();
    }, [auth]);

    return (
        <AuthContext.Provider value={{ user, userData, loading }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext); 