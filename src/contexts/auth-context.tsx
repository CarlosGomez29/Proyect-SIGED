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
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true, role: null });

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
      
      const targetDashboard = getDashboardByRole(devRole);
       if (pathname === '/login' || pathname === '/signup') {
         router.push(targetDashboard);
       }
      return; // Skip Firebase auth listener in dev mode if role is set
    }


    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const userRole = docSnap.data().role as UserRole;
          setRole(userRole);
          // Redirect based on role
          const targetDashboard = getDashboardByRole(userRole);
          if (pathname !== targetDashboard && !pathname.startsWith(targetDashboard)) {
            // router.push(targetDashboard);
          }
        } else {
          setRole(null);
          router.push('/login'); // Or an error page
        }
      } else {
        setUser(null);
        setRole(null);
        const allowedPaths = ['/login', '/signup'];
        if (!allowedPaths.includes(pathname)) {
            router.push('/login');
        }
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router, pathname]);

  const getDashboardByRole = (role: UserRole) => {
    switch (role) {
      case 'super-admin':
      case 'administrador':
        return '/dashboard-admin';
      case 'admision':
        return '/dashboard-admision';
      case 'instructor':
        return '/dashboard-instructor';
      case 'alumno':
        return '/dashboard-alumno';
      default:
        return '/login';
    }
  };


  return (
    <AuthContext.Provider value={{ user, loading, role }}>
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