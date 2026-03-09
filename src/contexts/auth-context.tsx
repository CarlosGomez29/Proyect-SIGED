
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';

type UserRole = 'super-admin' | 'administrador' | 'admision' | 'docente' | 'alumno' | null;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: UserRole;
  handleLogout: () => void;
  impersonatedSchool: { id: string; nombre: string } | null;
  startImpersonation: (school: { id: string; nombre: string }) => void;
  stopImpersonation: () => void;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  role: null, 
  handleLogout: () => {},
  impersonatedSchool: null,
  startImpersonation: () => {},
  stopImpersonation: () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);
  const [impersonatedSchool, setImpersonatedSchool] = useState<{ id: string; nombre: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    // Restore impersonation from local storage
    const saved = localStorage.getItem('impersonatedSchool');
    if (saved) {
      try {
        setImpersonatedSchool(JSON.parse(saved));
      } catch (e) {
        localStorage.removeItem('impersonatedSchool');
      }
    }

    const devRole = localStorage.getItem('userRole') as UserRole;
    if (devRole && process.env.NODE_ENV === 'development') {
      setRole(devRole);
      setLoading(false);
      return; 
    }

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setRole(docSnap.data().role as UserRole);
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
    localStorage.removeItem('userRole');
    localStorage.removeItem('impersonatedSchool');
    router.push('/');
  };

  const startImpersonation = (school: { id: string; nombre: string }) => {
    setImpersonatedSchool(school);
    localStorage.setItem('impersonatedSchool', JSON.stringify(school));
    router.push('/dashboard-admin');
  };

  const stopImpersonation = () => {
    setImpersonatedSchool(null);
    localStorage.removeItem('impersonatedSchool');
    router.push('/dashboard/admin/escuelas');
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      role, 
      handleLogout, 
      impersonatedSchool, 
      startImpersonation, 
      stopImpersonation 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
