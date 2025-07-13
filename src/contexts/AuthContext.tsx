import { createContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase';
import { useLoading } from './LoadingContext';

interface AuthContextValue {
  user: User | null;
  userId: string | null; // Add userId to the context
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, userId: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userId, setUserId] = useState<string | null>(null); // State for userId
  const [loading, setLoading] = useState(true);
  const { setLoading: setGlobalLoading } = useLoading();

  useEffect(() => {
    let isInitialLoad = true;

    const unsubscribe = onAuthStateChanged(auth, (u) => {
      if (isInitialLoad) {
        setGlobalLoading(false);
        isInitialLoad = false;
      }
      setUser(u);
      setUserId(u?.uid || null); // Set userId from Firebase user
      if (u?.uid) {
        localStorage.setItem('userId', u.uid); // Persist userId in localStorage
      } else {
        localStorage.removeItem('userId'); // Clear userId if user logs out
      }
      setLoading(false);
    });

    setGlobalLoading(true);

    return () => {
      unsubscribe();
      setGlobalLoading(false);
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, userId, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
