"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter, usePathname } from 'next/navigation';

type UserRole = 'super-admin' | 'administrador' | 'admision' | 'instructor' | 'alumno' | null;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: UserRole;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, role: null, handleLogout: () => {} });

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Development mode check
    const devRole = localStorage.getItem('userRole') as UserRole;
    if (devRole && process.env.NODE_ENV === 'development') {
      setRole(devRole);
      setLoading(false);
      // Let pages handle redirection if needed
      return; 
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userRole = docSnap.data().role as UserRole;
          setRole(userRole);
        } else {
          setRole(null);
        }
      } else {
        setUser(null);
        setRole(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userRole'); // For dev mode
    // await auth.signOut(); // For production
    router.push('/login');
  };


  return (
    <AuthContext.Provider value={{ user, loading, role, handleLogout }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export const withAuth = (Component: React.ComponentType<any>, allowedRoles: UserRole[]) => {
    return function WithAuth(props: any) {
        const { loading, role } = useAuth();
        const router = useRouter();

        useEffect(() => {
            if (!loading && role && !allowedRoles.includes(role)) {
                router.push('/login'); // Or an access denied page
            }
        }, [loading, role, router]);

        if (loading || (role && !allowedRoles.includes(role))) {
            return <div>Loading...</div>; // Or a proper loader
        }

        return <Component {...props} />;
    };
};
