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
import { useAuth } from '@/contexts/auth-context';

const profileDetails: { [key: string]: { name: string; icon: React.ElementType; accentColor: string; shadowColor: string; welcomeMessage: string; dbRole: string; } } = {
  'super-admin': { name: 'Super Admin', icon: ShieldCheck, accentColor: 'text-primary', shadowColor: 'shadow-primary/20', welcomeMessage: 'Bienvenido, Super Admin', dbRole: 'superadmin' },
  'administrador': { name: 'Administrador', icon: UserCog, accentColor: 'text-blue-500', shadowColor: 'shadow-blue-500/20', welcomeMessage: 'Bienvenido, Administrador', dbRole: 'admin' },
  'admision': { name: 'Admisiones', icon: UserPlus, accentColor: 'text-green-500', shadowColor: 'shadow-green-500/20', welcomeMessage: 'Bienvenido a Admisiones', dbRole: 'admision' },
  'docente': { name: 'Docente', icon: BookUser, accentColor: 'text-teal-500', shadowColor: 'shadow-teal-500/20', welcomeMessage: 'Bienvenido, Docente', dbRole: 'docente' },
  'alumno': { name: 'Estudiante', icon: GraduationCap, accentColor: 'text-sky-500', shadowColor: 'shadow-sky-500/20', welcomeMessage: 'Bienvenido, Estudiante', dbRole: 'alumno' },
};

export default function RoleLoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { role } = useParams() as { role: string };
  
  
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
    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          password,
          expectedRole: details.dbRole
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al iniciar sesión');
      }

      // 5. Iniciar sesión en el contexto (el servidor ya puso la cookie)
      handleLoginSuccess(data.user);

      toast({
        title: "Sesión Iniciada",
        description: `Bienvenido al sistema, ${data.user.nombre}.`,
      });

      // Redirección por rol
      switch (data.user.rol) {
        case 'superadmin': router.push('/dashboard/admin'); break;
        case 'admin': router.push('/dashboard-admin'); break;
        case 'admision': router.push('/dashboard/admision'); break;
        case 'docente': router.push('/dashboard-docente'); break;
        case 'alumno': router.push('/dashboard-alumno'); break;
        case 'instructor': router.push('/dashboard-admin'); break; // Ajustar según corresponda
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
