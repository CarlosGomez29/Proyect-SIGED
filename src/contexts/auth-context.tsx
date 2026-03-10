
"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'superadmin' | 'admin' | 'admision' | 'docente' | 'alumno' | null;

interface AuthContextType {
  user: User | null;
  loading: boolean;
  role: UserRole;
  handleLogout: () => Promise<void>;
  impersonatedSchool: { id: string; nombre: string } | null;
  startImpersonation: (school: { id: string; nombre: string }) => void;
  stopImpersonation: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  role: null, 
  handleLogout: async () => {},
  impersonatedSchool: null,
  startImpersonation: () => {},
  stopImpersonation: () => {},
  refreshProfile: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState<UserRole>(null);
  const [impersonatedSchool, setImpersonatedSchool] = useState<{ id: string; nombre: string } | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const fetchUserProfile = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        const data = docSnap.data();
        const userRole = data.rol as UserRole;
        const userStatus = (data.estado || 'activo').toLowerCase();
        
        // Bloqueo solo si el estado es inactivo y NO es superadmin
        if (userRole !== 'superadmin' && userStatus === 'inactivo') {
          await signOut(auth);
          toast({
            variant: "destructive",
            title: "Acceso denegado",
            description: "Su cuenta se encuentra inactiva. Contacte al administrador.",
          });
          return null;
        }
        
        return userRole;
      }
      return null;
    } catch (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }
  };

  const refreshProfile = async () => {
    if (user) {
      const userRole = await fetchUserProfile(user.uid);
      setRole(userRole);
    }
  };

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

    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      if (firebaseUser) {
        const userRole = await fetchUserProfile(firebaseUser.uid);
        if (userRole) {
          setUser(firebaseUser);
          setRole(userRole);
        } else {
          setUser(null);
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

  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('impersonatedSchool');
      setImpersonatedSchool(null);
      setUser(null);
      setRole(null);
      router.push('/');
    } catch (error) {
      console.error("Error signing out:", error);
    }
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
      stopImpersonation,
      refreshProfile
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
