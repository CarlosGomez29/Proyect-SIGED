"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

type UserRole = 'superadmin' | 'admin' | 'admision' | 'docente' | 'alumno' | 'instructor' | null;

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
  handleLogout: () => Promise<void>;
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
  handleLogout: async () => {},
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
    // Ya no guardamos en localStorage, la cookie HttpOnly maneja la sesión
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('impersonatedSchool'); // Esto es metadata, no crítico
      setUser(null);
      setImpersonatedSchool(null);
      router.push('/');
    } catch (e) {
      console.error("Logout error", e);
    }
  };

  const refreshProfile = async () => {
    // Sincronizar con el endpoint /api/auth/me
    try {
      const res = await fetch('/api/auth/me');
      const data = await res.json();
      if (data.user) {
        setUser(data.user);
      } else {
        setUser(null);
        // El middleware se encargará de redirigir si es necesario
      }
    } catch (e) {
      console.error("Refresh profile error", e);
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      await refreshProfile();
      
      const savedImpersonation = localStorage.getItem('impersonatedSchool');
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
