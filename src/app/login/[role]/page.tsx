
"use client";

import { useState } from 'react';
import Link from "next/link";
import { useRouter, useParams } from 'next/navigation';
import {
  ShieldCheck,
  UserCog,
  UserPlus,
  BookUser,
  GraduationCap,
  User as UserIcon,
  Lock,
  ArrowLeft,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import images from "@/app/lib/placeholder-images";
import { useFirestore } from '@/firebase';
import { collection, query, where, getDocs, limit } from 'firebase/firestore';
import { useAuth } from '@/contexts/auth-context';
import { hashPassword } from '@/lib/hash';

const profileDetails: { [key: string]: { name: string; icon: React.ElementType; accentColor: string; shadowColor: string; welcomeMessage: string; } } = {
  'super-admin': { name: 'Super Admin', icon: ShieldCheck, accentColor: 'text-primary', shadowColor: 'shadow-primary/20', welcomeMessage: 'Bienvenido, Super Admin' },
  'administrador': { name: 'Administrador', icon: UserCog, accentColor: 'text-blue-500', shadowColor: 'shadow-blue-500/20', welcomeMessage: 'Bienvenido, Administrador' },
  'admision': { name: 'Admisiones', icon: UserPlus, accentColor: 'text-green-500', shadowColor: 'shadow-green-500/20', welcomeMessage: 'Bienvenido a Admisiones' },
  'docente': { name: 'Docente', icon: BookUser, accentColor: 'text-teal-500', shadowColor: 'shadow-teal-500/20', welcomeMessage: 'Bienvenido, Docente' },
  'alumno': { name: 'Estudiante', icon: GraduationCap, accentColor: 'text-sky-500', shadowColor: 'shadow-sky-500/20', welcomeMessage: 'Bienvenido, Estudiante' },
};

export default function RoleLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { role } = useParams() as { role: string };
  
  const db = useFirestore();
  const { handleLoginSuccess } = useAuth();

  const details = profileDetails[role];

  if (!details) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
             <div className="relative z-10 w-full max-w-md">
                <div className="bg-black/50 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl p-8">
                    <h1 className="text-2xl font-bold text-white text-center">Perfil no válido</h1>
                    <p className="text-muted-foreground mt-2 text-center">El perfil seleccionado no existe.</p>
                    <Button onClick={() => router.push('/login')} className="w-full mt-6">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Volver a la selección
                    </Button>
                </div>
            </div>
        </div>
    )
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting || !db) return;

    setIsSubmitting(true);

    try {
      // 1. Buscar usuario por username
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("username", "==", username.trim()), limit(1));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        throw new Error("Usuario no encontrado.");
      }

      const userDoc = querySnapshot.docs[0];
      const userData = userDoc.data();

      // 2. Verificar hash de contraseña
      const inputHash = await hashPassword(password);
      if (inputHash !== userData.passwordHash) {
        throw new Error("Contraseña incorrecta.");
      }

      // 3. Validar estado (excepto superadmin)
      const userStatus = (userData.estado || 'activo').toLowerCase();
      if (userData.rol !== 'superadmin' && userStatus === 'inactivo') {
        throw new Error("Su cuenta se encuentra inactiva. Por favor, contacte al Super Admin.");
      }

      // 4. Iniciar sesión manual en el contexto
      handleLoginSuccess({
        uid: userDoc.id,
        username: userData.username,
        nombre: userData.nombre,
        apellido: userData.apellido,
        rol: userData.rol,
        escuelaId: userData.escuelaId,
        estado: userData.estado
      });

      toast({
        title: "Sesión Iniciada",
        description: `Bienvenido al sistema, ${userData.nombre}.`,
      });

      // Redirección por rol
      switch (userData.rol) {
        case 'superadmin': router.push('/dashboard/admin'); break;
        case 'admin': router.push('/dashboard-admin'); break;
        case 'admision': router.push('/dashboard/admision'); break;
        case 'docente': router.push('/dashboard-docente'); break;
        case 'alumno': router.push('/dashboard-alumno'); break;
        default: router.push('/');
      }

    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error de Acceso",
        description: error.message || "Credenciales inválidas.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const Icon = details.icon;

  return (
    <div className="relative flex items-center justify-center min-h-screen bg-background text-white p-4">
       <Image
        src={images.login_background.url}
        alt="Background"
        fill
        priority
        className="z-0 object-cover filter brightness-50 blur-md"
        data-ai-hint={images.login_background.hint}
      />
       <Button asChild variant="ghost" className="absolute top-4 left-4 z-20 bg-transparent text-white hover:bg-white/10 hover:text-white">
            <Link href="/login">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Volver
            </Link>
        </Button>

      <div className="relative z-10 flex flex-col items-center w-full max-w-md">
        
        <div className={`w-full bg-black/30 backdrop-blur-lg rounded-2xl border border-white/10 shadow-2xl ${details.shadowColor}`}>
            <div className="flex flex-col items-center p-8">
                 <div className={`relative flex h-24 w-24 items-center justify-center rounded-full bg-white/10 border border-white/20 shadow-lg mb-6 ${details.accentColor}`}>
                    <div className="absolute inset-0 rounded-full bg-current opacity-20 blur-xl"></div>
                    <Icon className="h-12 w-12" />
                </div>
                 <h1 className="text-2xl font-bold text-center">{details.welcomeMessage}</h1>
                 <p className="text-muted-foreground text-center text-sm mb-8">Portal Institucional SIGED</p>
                 
                <form onSubmit={handleLogin} className="grid gap-4 w-full">
                    <div className="space-y-2">
                        <div className="relative">
                            <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="username"
                                type="text"
                                placeholder="Nombre de usuario"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>
                     <div className="space-y-2">
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Contraseña"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-muted-foreground focus:border-primary"
                                disabled={isSubmitting}
                            />
                        </div>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full mt-4 text-base py-6 font-bold uppercase tracking-widest"
                      disabled={isSubmitting}
                    >
                        {isSubmitting ? (
                          <><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Procesando...</>
                        ) : (
                          "Ingresar al Sistema"
                        )}
                    </Button>
                </form>
            </div>
        </div>
        <p className="mt-8 text-neutral-500 text-xs font-medium uppercase tracking-widest">
          DIGEV — Sistema de Gestión Académica
        </p>
      </div>
    </div>
  );
}
