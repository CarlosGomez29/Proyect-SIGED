"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'superadmin' | 'admin' | 'admision' | 'docente' | 'alumno' | null;

interface AuthUser {
  uid: string;
  username: string;
  nombre: string;
  apellido: string;
  rol: UserRole;
  escuelaId?: string | null;
  estado: string;
}

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  role: UserRole;
  handleLogout: () => void;
  handleLoginSuccess: (userData: AuthUser) => void;
  impersonatedSchool: { id: string; nombre: string } | null;
  startImpersonation: (school: { id: string; nombre: string }) => void;
  stopImpersonation: () => void;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({ 
  user: null, 
  loading: true, 
  role: null, 
  handleLogout: () => {},
  handleLoginSuccess: () => {},
  impersonatedSchool: null,
  startImpersonation: () => {},
  stopImpersonation: () => {},
  refreshProfile: async () => {}
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [impersonatedSchool, setImpersonatedSchool] = useState<{ id: string; nombre: string } | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleLoginSuccess = (userData: AuthUser) => {
    setUser(userData);
    localStorage.setItem('siged_session', JSON.stringify(userData));
  };

  const handleLogout = () => {
    localStorage.removeItem('siged_session');
    localStorage.removeItem('impersonatedSchool');
    setUser(null);
    setImpersonatedSchool(null);
    router.push('/');
  };

  const refreshProfile = async () => {
    if (!user) return;
    try {
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as any;
        const updatedUser = { 
          ...data, 
          uid: docSnap.id,
          username: data.username,
          nombre: data.nombre,
          apellido: data.apellido,
          rol: data.rol as UserRole,
          escuelaId: data.escuelaId,
          estado: data.estado
        };
        
        if ((data.estado || '').toLowerCase() !== 'activo') {
          handleLogout();
          toast({ variant: "destructive", title: "Acceso denegado", description: "Este usuario se encuentra desactivado. Contacte al administrador." });
          return;
        }

        setUser(updatedUser);
        localStorage.setItem('siged_session', JSON.stringify(updatedUser));
      }
    } catch (e) {
      console.error("Error refreshing profile", e);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      const session = localStorage.getItem('siged_session');
      const savedImpersonation = localStorage.getItem('impersonatedSchool');

      if (session) {
        try {
          const parsedSession = JSON.parse(session) as AuthUser;
          // Validar estado actual en Firestore en cada recarga de sesión
          const docRef = doc(db, 'users', parsedSession.uid);
          const docSnap = await getDoc(docRef);
          
          if (docSnap.exists()) {
            const currentData = docSnap.data();
            const estado = (currentData.estado || '').toLowerCase();
            
            if (estado !== 'activo') {
              handleLogout();
              toast({ 
                variant: "destructive", 
                title: "Acceso denegado", 
                description: "Este usuario se encuentra desactivado. Contacte al administrador." 
              });
            } else {
              setUser({ 
                ...parsedSession, 
                estado: currentData.estado, 
                rol: currentData.rol as UserRole,
                nombre: currentData.nombre,
                apellido: currentData.apellido,
                escuelaId: currentData.escuelaId
              });
            }
          } else {
            handleLogout();
          }
        } catch (e) {
          localStorage.removeItem('siged_session');
        }
      }

      if (savedImpersonation) {
        try {
          setImpersonatedSchool(JSON.parse(savedImpersonation));
        } catch (e) {
          localStorage.removeItem('impersonatedSchool');
        }
      }
      setLoading(false);
    };

    checkSession();
  }, []);

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
      role: user?.rol || null, 
      handleLogout, 
      handleLoginSuccess,
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
