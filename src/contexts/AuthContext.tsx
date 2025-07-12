import { createContext, useEffect, useState, ReactNode } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/firebase';
import { useLoading } from './LoadingContext';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextValue>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { setLoading: setGlobalLoading } = useLoading();

  useEffect(() => {
    let isInitialLoad = true;
    console.log('AuthContext: useEffect started');
    
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      console.log('AuthContext: onAuthStateChanged fired with user:', u ? 'logged in' : 'not logged in');
      if (isInitialLoad) {
        console.log('AuthContext: stopping global loading (initial load)');
        setGlobalLoading(false); // Para o loading global apenas na primeira vez
        isInitialLoad = false;
      }
      setUser(u);
      setLoading(false);
    });

    // Inicia o loading global
    console.log('AuthContext: starting global loading');
    setGlobalLoading(true);
    
    return () => {
      console.log('AuthContext: cleanup');
      unsubscribe();
      setGlobalLoading(false); // Garante que o loading seja removido ao desmontar
    };
  }, []); // Remove a dependência setGlobalLoading

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export default AuthContext;
